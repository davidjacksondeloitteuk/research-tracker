from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    __test__ = False

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    profile_picture: Mapped[str | None] = mapped_column(String(255), nullable=True, default=None)
    date_created: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    created_projects: Mapped[list["Project"]] = relationship(
        "Project", back_populates="user_created"
    )
    created_tasks: Mapped[list["Task"]] = relationship(
        "Task", back_populates="user_created"
    )

    assigned_projects: Mapped[list["UserProject"]] = relationship(
        "UserProject", back_populates="user"
    )
    assigned_tasks: Mapped[list["UserTask"]] = relationship(
        "UserTask", back_populates="user"
    )
    created_updates: Mapped[list["Update"]] = relationship(
        "Update", back_populates="user_created"
    )


class Project(Base):
    __tablename__ = "projects"
    __test__ = False

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    date_created: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    user_created_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))

    user_created: Mapped[User] = relationship("User", back_populates="created_projects")
    assigned_users: Mapped[list["UserProject"]] = relationship(
        "UserProject", back_populates="project"
    )
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="project")


class UserProject(Base):
    __tablename__ = "user_projects"
    __test__ = False

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True
    )
    is_lead: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    user: Mapped[User] = relationship("User", back_populates="assigned_projects")
    project: Mapped[Project] = relationship("Project", back_populates="assigned_users")


class Task(Base):
    __tablename__ = "tasks"
    __test__ = False

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    in_review: Mapped[bool] = mapped_column(nullable=False, default=False)
    completed: Mapped[bool] = mapped_column(nullable=False, default=False)
    date_created: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    user_created_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user_created: Mapped[User] = relationship("User", back_populates="created_tasks")
    assigned_users: Mapped[list["UserTask"]] = relationship("UserTask", back_populates="task")
    project: Mapped[Project] = relationship("Project", back_populates="tasks")
    updates: Mapped[list["Update"]] = relationship("Update", back_populates="task")


class UserTask(Base):
    __tablename__ = "user_tasks"
    __test__ = False

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True
    )

    user: Mapped[User] = relationship("User", back_populates="assigned_tasks")
    task: Mapped[Task] = relationship("Task", back_populates="assigned_users")


class Update(Base):
    __tablename__ = "updates"
    __test__ = False

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), nullable=False)
    user_created_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(255), nullable=False, server_default="NULL")
    content: Mapped[str] = mapped_column(String(255), nullable=False, server_default="NULL")
    date_created: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    task: Mapped[Task] = relationship("Task", back_populates="updates")
    user_created: Mapped[User] = relationship("User", back_populates="created_updates")