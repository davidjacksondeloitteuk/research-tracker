import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import get_db
from app.database.models import Base
from app.main import app

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def client():
    Base.metadata.create_all(bind=engine)
    db: Session = TestingSessionLocal()
    app.dependency_overrides[get_db] = lambda: db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_projects_include_their_tasks(client: TestClient) -> None:
    user = client.post(
        "/api/users/register",
        json={"username": "researcher", "first_name": "Rae", "last_name": "Search", "password": "secret123"},
    ).json()
    project = client.post(
        "/api/projects",
        json={"name": "Research", "user_created_id": user["id"]},
    )
    assert project.status_code == 201
    assert project.json()["tasks"] == []

    project_id = project.json()["id"]
    task = client.post(
        "/api/tasks",
        json={"project_id": project_id, "user_created_id": user["id"], "name": "Read paper"},
    )
    assert task.status_code == 201
    assert task.json()["project_id"] == project_id

    for response in (client.get(f"/api/projects/{project_id}"), client.get("/api/projects")):
        assert response.status_code == 200
        project_data = response.json() if isinstance(response.json(), dict) else response.json()[0]
        assert [item["name"] for item in project_data["tasks"]] == ["Read paper"]


def test_create_project_with_tasks(client: TestClient) -> None:
    user = client.post(
        "/api/users/register",
        json={"username": "researcher", "first_name": "Rae", "last_name": "Search", "password": "secret123"},
    ).json()
    response = client.post(
        "/api/projects",
        json={"name": "Research", "user_created_id": user["id"], "tasks": [{"name": "Read paper", "description": "Review the source"}]},
    )

    assert response.status_code == 201
    project = response.json()
    assert len(project["tasks"]) == 1
    assert project["tasks"][0]["name"] == "Read paper"
    assert project["tasks"][0]["description"] == "Review the source"
    assert project["tasks"][0]["project_id"] == project["id"]


def test_missing_project_returns_404(client: TestClient) -> None:
    assert client.get("/api/projects/999").status_code == 404
    user = client.post(
        "/api/users/register",
        json={"username": "researcher", "first_name": "Rae", "last_name": "Search", "password": "secret123"},
    ).json()
    response = client.post(
        "/api/tasks",
        json={"project_id": 999, "user_created_id": user["id"], "name": "Read paper"},
    )
    assert response.status_code == 404