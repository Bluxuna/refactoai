from fastapi import FastAPI, HTTPException,APIRouter
from dotenv import load_dotenv
import os
from database.db_models import Task

from typing import List, Optional, Dict
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from agentic.tools import ScriptRunner,CodeChecker
from agentic.main import Assistant_agent
from pydantic import BaseModel

load_dotenv()
app = APIRouter()

class Database_Crud:
    def __init__(self):
        db_path = os.getenv("DATABASE_PATH")
        self.engine = create_engine(f"sqlite:///{db_path}")
        self.SessionLocal = sessionmaker(bind=self.engine)

    def get_session(self) -> Session:
        return self.SessionLocal()

    def get_all_tasks(self) -> List[Task]:
        with self.get_session() as session:
            return session.query(Task).all()

    def get_task_by_id(self, task_id: int) -> Task:
        with self.get_session() as session:
            return session.query(Task).filter(Task.id == task_id).first()

    def get_tasks_by_topic(seget_task_by_idlf, topic: str) -> List[Task]:
        with self.get_session() as session:
            return session.query(Task).filter(Task.topic == topic).all()







# Initialize database CRUD
db = Database_Crud()

@app.get("/")
def get_all_info():
    return {"test":"test"}
@app.get("/tasks")
def get_tasks():
    tasks = db.get_all_tasks()
    return {"tasks": [{"id":task.id,"name":task.name,"topic":task.topic} for task in tasks]}


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    task = db.get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.get("/tasks/topic/{topic}")
def get_tasks_by_topic(topic: str):
    tasks = db.get_tasks_by_topic(topic)
    return {"tasks": tasks}


class MultilineData(BaseModel):
    lines: list[str]


@app.post("/tasks/{task_id}/run")
def run_code_by_task_id(task_id: int, request: MultilineData):
    task = db.get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Join lines into single string for execution
    code = "\n".join(request.lines)
    print(code)
    res = ScriptRunner.run_python_code(code)

    return {"res": res}


@app.post("/task/{task_id}/manual_quality_checker")
def run_code_by_task_id(task_id: int, request: MultilineData):
    task = db.get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Join lines into single string for execution
    code = "\n".join(request.lines)
    print(code)
    res = CodeChecker.check_code_with_pylint(code)


    return {"res": res}

@app.post("/task/{task_id}/AI_checker")
def run_code_by_task_id(task_id: int, request: str):
    task = db.get_task_by_id(task_id)
    #
    # code = request
    # pylint_report = CodeChecker.check_code_with_pylint(code)
    agent = Assistant_agent()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")


    problem = task.name+ "\n" + task.description

    code = request
    print(code)
    pylint_report = CodeChecker.check_code_with_pylint(code)
    print("pylint response", pylint_report)
    response = agent.run(problem,pylint_report,task.correct_code, code)

    return {"res": response}

@app.post("/chat")
def chat(messages:dict):
    agent = Assistant_agent()
    response = agent.invoke_llm_for_chat(messages)

    return response








