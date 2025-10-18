from sqlalchemy import (
    create_engine,
    String,
    Text,
    Boolean,
    Integer,
    ForeignKey,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)


class Base(DeclarativeBase):
    pass


# ───────────────────────────────────────────────
# TASK TABLE
# ───────────────────────────────────────────────
class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    topic: Mapped[str] = mapped_column(String(50), nullable=False)
    type: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)  # True=train, False=refactor
    correct_code: Mapped[str] = mapped_column(Text, nullable=False)
    messed_code: Mapped[str] = mapped_column(Text, nullable=False)

    # ORM relationship
    input_outputs: Mapped[list["InputOutput"]] = relationship(
        back_populates="task",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, name={self.name}, topic={self.topic})>"


# ───────────────────────────────────────────────
# INPUT_OUTPUT TABLE (links Task to its I/O sets)
# ───────────────────────────────────────────────
class InputOutput(Base):
    __tablename__ = "input_output"

    id: Mapped[int] = mapped_column(primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), nullable=False)

    # ORM relationships
    task: Mapped["Task"] = relationship(back_populates="input_outputs")
    inputs: Mapped[list["Input"]] = relationship(
        back_populates="input_output",
        cascade="all, delete-orphan"
    )
    outputs: Mapped[list["Output"]] = relationship(
        back_populates="input_output",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<InputOutput(id={self.id}, task_id={self.task_id})>"


# ───────────────────────────────────────────────
# INPUT TABLE
# ───────────────────────────────────────────────
class Input(Base):
    __tablename__ = "input"

    id: Mapped[int] = mapped_column(primary_key=True)
    input: Mapped[str] = mapped_column(String(100), nullable=False)
    input_type: Mapped[str] = mapped_column(String(50), nullable=False)
    input_output_id: Mapped[int] = mapped_column(ForeignKey("input_output.id"), nullable=False)

    # ORM relationship
    input_output: Mapped["InputOutput"] = relationship(back_populates="inputs")

    def __repr__(self) -> str:
        return f"<Input(id={self.id}, type={self.input_type})>"


# ───────────────────────────────────────────────
# OUTPUT TABLE
# ───────────────────────────────────────────────
class Output(Base):
    __tablename__ = "output"

    id: Mapped[int] = mapped_column(primary_key=True)
    output: Mapped[str] = mapped_column(String(100), nullable=False)
    output_type: Mapped[str] = mapped_column(String(50), nullable=False)
    input_output_id: Mapped[int] = mapped_column(ForeignKey("input_output.id"), nullable=False)

    # ORM relationship
    input_output: Mapped["InputOutput"] = relationship(back_populates="outputs")

    def __repr__(self) -> str:
        return f"<Output(id={self.id}, type={self.output_type})>"
