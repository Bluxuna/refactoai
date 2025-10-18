from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass

class Task(Base):

    __tablename__ = "Task"



    def __repr__(self):
        return "task table with this column and types"

