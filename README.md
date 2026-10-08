# Research Tracker

A full-stack starter project with a React and TypeScript frontend, a FastAPI backend, and PostgreSQL. The frontend and backend are separate apps under `apps/`; Docker Compose runs the local database.

The starter currently includes a sample list API and UI, user registration/login routes, database models, and Alembic migrations.

## Requirements

- Node.js 20.19+ or 22.12+, and npm
- Python 3.12+
- Docker Desktop (or Docker Engine with the Compose plugin)

## Get Started

First fork the repository to your account before cloning:

```bash
git clone <forked-repo>
cd <project-name>
npm run rename
npm ci
```

Set up the Python backend in a second terminal from the repository root:

```bash
cd apps/backend
cp .env.example .env
python3.12 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cd ../..
```

Create the frontend's local environment file from its example:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

Start PostgreSQL and apply the database migrations:

```bash
npm run db:up
npm run api:migrate
```

Run the frontend and backend in separate terminals, both from the repository root:

```bash
npm run dev
```

```bash
npm run api:dev
```

Open the frontend at <http://localhost:5173>. The API is at <http://localhost:8000>; its interactive documentation is at <http://localhost:8000/docs> and its health check is <http://localhost:8000/api/health>.

The API defaults to the database configured in `apps/backend/.env.example`: host `localhost`, port `5433`, database `research_tracker_db`. The Compose service maps this to PostgreSQL's container port `5432` to avoid colliding with a local PostgreSQL server.

The frontend's `apps/frontend/.env.local` sets the API base URL. The copied example points to the local backend; edit it if your API runs elsewhere:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Vite reads `VITE_`-prefixed variables at startup, so restart the frontend after changing this value.

## Useful Commands

Run these from the repository root unless otherwise noted:

| Command               | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Start the frontend development server     |
| `npm run api:dev`     | Start the FastAPI development server      |
| `npm run db:up`       | Start PostgreSQL in Docker                |
| `npm run db:down`     | Stop the database container               |
| `npm run db:wipe`     | Stop the database container and wipe data |
| `npm run api:migrate` | Apply pending Alembic migrations          |
| `npm run build`       | Build the frontend                        |
| `npm run test:run`    | Run frontend tests                        |
| `npm run lint`        | Lint the JavaScript/TypeScript workspace  |
| `npm run typecheck`   | Type-check the frontend                   |

Run backend tests from `apps/backend` with the virtual environment activated:

```bash
pytest
```

Command to open docker container:
```bash
docker compose exec postgres psql -U postgres_user -d <db_name>
```

## Database Tables and Migrations

SQLAlchemy table models live in `apps/backend/app/database/models.py`, and Alembic uses `Base.metadata` from that module to detect schema changes. To add or change a table:

1. Add or update a SQLAlchemy model in `models.py`.
2. From `apps/backend`, generate a migration:

    ```bash
    alembic revision --autogenerate -m "create notes table" --rev-id=yyyymmdd_vvvv
    ```

3. Review the new file under `apps/backend/alembic/versions/`. Autogeneration is a starting point; confirm the operations and any data migration are correct.
4. Apply the migration from the repository root:

    ```bash
    npm run api:migrate
    ```

Do not edit an already-applied migration to change a database. Create another migration instead. To inspect the current migration revision, run `alembic current` from `apps/backend`; to list revisions, run `alembic history` there.

## Example: Table to Frontend

This example adds a `notes` table, exposes a create-note API function, and calls it from the frontend.

### 1. Define the table

In `apps/backend/app/database/models.py`, add `Text` to the SQLAlchemy imports and define the model alongside the existing models:

```python
class Note(Base):
    __tablename__ = "notes"
    __test__ = False

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
```

Generate and review the migration as described above, then run `npm run api:migrate` from the repository root. The migration creates the table in PostgreSQL.

### 2. Define the API schema and function

In `apps/backend/app/database/schemas.py`, define request and response shapes. `from_attributes=True` lets the response schema serialize a SQLAlchemy model:

```python
class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    body: str


class NoteResponse(BaseModel):
    id: int
    title: str
    body: str

    model_config = ConfigDict(from_attributes=True)
```

Create `apps/backend/app/routes/note_routes.py` with a FastAPI endpoint that saves a note and returns it:

```python
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Note
from app.database.schemas import NoteCreate, NoteResponse

router = APIRouter()


@router.post(
    "/api/notes",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_note(payload: NoteCreate, db: Session = Depends(get_db)) -> Note:
    note = Note(title=payload.title, body=payload.body)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
```

Register the router in `apps/backend/app/main.py` by importing `note_routes` and adding:

```python
app.include_router(note_routes.router)
```

### 3. Call the API from React

In a frontend component or API helper, send the same JSON fields to the endpoint. The API base URL matches the value used by the existing home page:

```typescript
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
});

if (!response.ok) {
    throw new Error('Unable to create note.');
}

const note: { id: number; title: string; body: string } = await response.json();
```

Use the returned `note` to update component state, as the existing list UI does after its `POST /api/list/add` request. Add a backend route test and a frontend component test when introducing a new feature.

## Project Layout

```text
apps/
  backend/   FastAPI app, SQLAlchemy models, Alembic migrations, pytest tests
  frontend/  React, TypeScript, Vite app and Vitest tests
docker-compose.yml  Local PostgreSQL service
```