"""add tasks project foreign key

Revision ID: 20261001_0002
Revises: 20261001_0001
Create Date: 2026-10-01
"""

from collections.abc import Sequence

from alembic import op

revision: str = "20261001_0002"
down_revision: str | Sequence[str] | None = "20261001_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_foreign_key("fk_tasks_project_id_projects", "tasks", "projects", ["project_id"], ["id"])


def downgrade() -> None:
    op.drop_constraint("fk_tasks_project_id_projects", "tasks", type_="foreignkey")