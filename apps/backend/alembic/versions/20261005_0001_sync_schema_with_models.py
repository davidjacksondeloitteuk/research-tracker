"""sync schema with models

Revision ID: 20261005_0001
Revises: 20261001_0003
Create Date: 2026-10-05
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20261005_0001"
down_revision: str | Sequence[str] | None = "20261001_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

TIMESTAMP_COLUMNS = [("users", "date_created"), ("projects", "date_created"), ("tasks", "date_created")]


def upgrade() -> None:
    op.add_column("users", sa.Column("profile_picture", sa.String(255), nullable=True))

    op.drop_constraint("fk_projects_created_by_id_users", "projects", type_="foreignkey")
    op.alter_column("projects", "created_by_id", new_column_name="user_created_id")
    op.create_foreign_key(
        "fk_projects_user_created_id_users", "projects", "users", ["user_created_id"], ["id"]
    )

    op.alter_column("user_projects", "is_project_lead", new_column_name="is_lead")

    op.alter_column("tasks", "name", new_column_name="title")
    op.add_column(
        "tasks", sa.Column("in_review", sa.Boolean(), nullable=False, server_default=sa.false())
    )
    op.add_column(
        "tasks", sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.false())
    )
    op.drop_constraint("fk_tasks_created_by_id_users", "tasks", type_="foreignkey")
    # Irreversible: tasks without a creator are deleted (assignments cascade).
    op.execute("DELETE FROM tasks WHERE created_by_id IS NULL")
    op.alter_column("tasks", "created_by_id", new_column_name="user_created_id", nullable=False)
    op.create_foreign_key(
        "fk_tasks_user_created_id_users", "tasks", "users", ["user_created_id"], ["id"]
    )

    op.rename_table("task_user_assignments", "user_tasks")

    for table, column in TIMESTAMP_COLUMNS:
        op.alter_column(
            table,
            column,
            type_=sa.DateTime(timezone=True),
            existing_type=sa.DateTime(),
            existing_nullable=False,
        )


def downgrade() -> None:
    for table, column in TIMESTAMP_COLUMNS:
        op.alter_column(
            table,
            column,
            type_=sa.DateTime(),
            existing_type=sa.DateTime(timezone=True),
            existing_nullable=False,
        )

    op.rename_table("user_tasks", "task_user_assignments")

    op.drop_constraint("fk_tasks_user_created_id_users", "tasks", type_="foreignkey")
    op.alter_column("tasks", "user_created_id", new_column_name="created_by_id", nullable=True)
    op.create_foreign_key(
        "fk_tasks_created_by_id_users",
        "tasks",
        "users",
        ["created_by_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.drop_column("tasks", "completed")
    op.drop_column("tasks", "in_review")
    op.alter_column("tasks", "title", new_column_name="name")

    op.alter_column("user_projects", "is_lead", new_column_name="is_project_lead")

    op.drop_constraint("fk_projects_user_created_id_users", "projects", type_="foreignkey")
    op.alter_column("projects", "user_created_id", new_column_name="created_by_id")
    op.create_foreign_key(
        "fk_projects_created_by_id_users",
        "projects",
        "users",
        ["created_by_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.drop_column("users", "profile_picture")
