from sqlalchemy import create_engine, Column, Integer, String,Text, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass

class Task(Base):
    __tablename__ = "tasks"  # lowercase and plural is conventional

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    topic: Mapped[str] = mapped_column(String(50), nullable=False)
    # true is train and false is refactor
    type: Mapped[str] = mapped_column(Boolean,default=True, nullable=False)
    correct_code: Mapped[str] = mapped_column(Text,nullable=False)
    messed_code: Mapped[str] = mapped_column(Text,nullable=False)

    def __repr__(self):
        return "task table with this column and types"


class InputOutput(Base):

    __tablename__ = "input_output"

    id: Mapped[int] = mapped_column(primary_key=True)
    task_id: Mapped[int] = mapped_column(Integer, nullable=False)

    def __repr__(self):
        return "many to many relation table for input output about task"

class Input(Base):
    __tablename__ = "input"

    id: Mapped[int] = mapped_column(primary_key=True)
    input: Mapped[str] = mapped_column(String(100), nullable=False)
    input_type: Mapped[str] = mapped_column(String(50), nullable=False)
    input_output_id: Mapped[int] = mapped_column(Integer, nullable=False)

    def __repr__(self):
        return "input table  about task"


class Output(Base):
    __tablename__ = "output"

    id: Mapped[int] = mapped_column(primary_key=True)
    output: Mapped[str] = mapped_column(String(100), nullable=False)
    output_type: Mapped[str] = mapped_column(String(50), nullable=False)
    input_output_id: Mapped[int] = mapped_column(Integer, nullable=False)

    def __repr__(self):
        return "output table  about task"