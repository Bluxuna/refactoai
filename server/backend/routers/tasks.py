# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy import select, func
# from sqlalchemy.orm import Session
#
# from backend.deps import get_db
# from database.db_models import Task, InputOutput
# # from database.db_schemas import (
# #     TaskSimpleResponse, TaskResponse,
# #     InputOutputResponse, InputResponse, OutputResponse
# # )
# import sqlite3
# import os
# from dotenv import load_dotenv
# from common.tools import CodeChecker,ScriptRunner
# from pydantic import BaseModel, Field, ConfigDict
# from typing import List, Optional
#
# load_dotenv()
# router = APIRouter()  # no prefix, so routes work alongside "/"
#
# from pydantic import BaseModel, Field, ConfigDict
# from typing import List, Optional
#
#
#
# class InputResponse(BaseModel):
#     """Schema for input data"""
#     model_config = ConfigDict(from_attributes=True)
#
#     id: int
#     input: str
#     input_type: str
#     input_output_id: int
#
#
# class OutputResponse(BaseModel):
#     """Schema for output data"""
#     model_config = ConfigDict(from_attributes=True)
#
#     id: int
#     output: str
#     output_type: str
#     input_output_id: int
#
#
# class InputOutputResponse(BaseModel):
#     """Schema for input-output group"""
#     model_config = ConfigDict(from_attributes=True)
#
#     id: int
#     task_id: int
#     inputs: List[InputResponse] = Field(default_factory=list)
#     outputs: List[OutputResponse] = Field(default_factory=list)
#
#
# class TaskSimpleResponse(BaseModel):
#     """Schema for basic task information"""
#     model_config = ConfigDict(from_attributes=True)
#
#     id: int
#     name: str
#     description: str
#     topic: str
#     type: bool = True
#     correct_code: Optional[str] = None
#     messed_code: Optional[str] = None
#
#
# class TaskResponse(TaskSimpleResponse):
#     """Schema for complete task information with relationships"""
#     input_outputs: List[InputOutputResponse] = Field(default_factory=list)
#
#
# class TopicsResponse(BaseModel):
#     """Schema for topics list"""
#     topics: List[str] = Field(default_factory=list)
#
#
# class TaskListResponse(BaseModel):
#     """Schema for task list response"""
#     items: List[TaskSimpleResponse]
#     total: int
#
#
# class CodeExecutionResponse(BaseModel):
#     """Schema for code execution response"""
#     task_id: int
#     success: bool
#     output: Optional[str] = None
#     error: Optional[str] = None
#     execution_time: Optional[float] = None
#
#
# class TaskService:
#     """Service layer for task-related operations"""
#
#     @staticmethod
#     def to_task_simple(task: Task) -> TaskSimpleResponse:
#         """Convert ORM Task to simple response model"""
#         return TaskSimpleResponse(
#             id=task.id,
#             name=task.name,
#             description=task.description,
#             topic=task.topic,
#             type=True,
#             correct_code=task.correct_code,
#             messed_code=task.messed_code
#         )
#
#     @staticmethod
#     def to_task_full(task: Task) -> TaskResponse:
#         """Convert ORM Task to full response model with relationships"""
#         input_outputs = []
#
#         for io_group in task.input_outputs or []:
#             inputs = [
#                 InputResponse(
#                     id=inp.id,
#                     input=inp.input,
#                     input_type=inp.input_type,
#                     input_output_id=inp.input_output_id
#                 )
#                 for inp in (io_group.inputs or [])
#             ]
#
#             outputs = [
#                 OutputResponse(
#                     id=out.id,
#                     output=out.output,
#                     output_type=out.output_type,
#                     input_output_id=out.input_output_id
#                 )
#                 for out in (io_group.outputs or [])
#             ]
#
#             input_outputs.append(
#                 InputOutputResponse(
#                     id=io_group.id,
#                     task_id=io_group.task_id,
#                     inputs=inputs,
#                     outputs=outputs
#                 )
#             )
#
#         return TaskResponse(
#             id=task.id,
#             name=task.name,
#             description=task.description,
#             topic=task.topic,
#             type=True,
#             correct_code=task.correct_code,
#             messed_code=task.messed_code,
#             input_outputs=input_outputs
#         )
#
#     @staticmethod
#     def get_all_topics(db: Session) -> List[str]:
#         """Retrieve all unique topics from database"""
#         rows = db.execute(select(func.distinct(Task.topic))).all()
#         return [row[0] for row in rows if row[0]]
#
#     @staticmethod
#     def get_tasks_by_topic(db: Session, topic: str) -> List[Task]:
#         """Retrieve all tasks for a given topic"""
#         return db.scalars(
#             select(Task).where(Task.topic == topic)
#         ).all()
#
#     @staticmethod
#     def get_task_by_id_and_topic(
#             db: Session,
#             task_id: int,
#             topic: str
#     ) -> Task:
#         """Retrieve a specific task by ID and topic"""
#         task = db.scalars(
#             select(Task).where(Task.id == task_id, Task.topic == topic)
#         ).first()
#
#         if not task:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Task with id {task_id} not found in topic '{topic}'"
#             )
#
#         return task
#
#     @staticmethod
#     def get_task_by_id(db: Session, task_id: int) -> Task:
#         """Retrieve a task by ID only"""
#         task = db.get(Task, task_id)
#
#         if not task:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Task with id {task_id} not found"
#             )
#
#         return task
#
#
# # --- Helpers to serialize ORM -> Pydantic ---
# def to_task_simple(task: Task) -> TaskSimpleResponse:
#     return TaskSimpleResponse(
#         id=task.id,
#         name=task.name,
#         description=task.description,
#         topic=task.topic,
#         type=True,  # default since not stored in DB
#         correct_code=task.correct_code,
#         messed_code=task.messed_code
#     )
#
#
# def to_task_full(task: Task) -> TaskResponse:
#     ios: list[InputOutputResponse] = []
#     for g in task.input_outputs or []:
#         ios.append(
#             InputOutputResponse(
#                 id=g.id,
#                 task_id=g.task_id,
#                 inputs=[
#                     InputResponse(
#                         id=i.id,
#                         input=i.input,
#                         input_type=i.input_type,
#                         input_output_id=i.input_output_id
#                     ) for i in (g.inputs or [])
#                 ],
#                 outputs=[
#                     OutputResponse(
#                         id=o.id,
#                         output=o.output,
#                         output_type=o.output_type,
#                         input_output_id=o.input_output_id
#                     ) for o in (g.outputs or [])
#                 ],
#             )
#         )
#
#     return TaskResponse(
#         id=task.id,
#         name=task.name,
#         description=task.description,
#         topic=task.topic,
#         type=True,
#         correct_code=task.correct_code,
#         messed_code=task.messed_code,
#         input_outputs=ios
#     )
#
#
# # ───────────────────────────────────────────────
# # ROUTES
# # ───────────────────────────────────────────────
#
# # /topics  → list all unique topics
# @router.get("/topics", summary="List all available topics")
# def list_topics(db: Session = Depends(get_db)):
#     rows = db.execute(select(func.distinct(Task.topic))).all()
#     return {"topics": [r[0] for r in rows]}
#
#
# # /topics/{topic}  → all tasks in a topic
# @router.get("/topics/{topic}", summary="List tasks under a topic")
# def tasks_in_topic(topic: str, db: Session = Depends(get_db)):
#     items = db.scalars(select(Task).where(Task.topic == topic)).all()
#     return {"items": [to_task_simple(t) for t in items], "total": len(items)}
#
#
# # /topics/{topic}/task={id}  → single task by topic and ID
# @router.get("/topics/{topic}/task={task_id}", response_model=TaskSimpleResponse, summary="Get single task")
# def task_by_topic_and_id(topic: str, task_id: int, db: Session = Depends(get_db)):
#     t = db.scalars(select(Task).where(Task.id == task_id, Task.topic == topic)).first()
#     if not t:
#         raise HTTPException(404, "Task not found")
#     return to_task_simple(t)
#
# # /topic/run_code/{topic}/task={taskid}
#
# @router.post(
#     "/tasks/{task_id}/execute",
#     response_model=CodeExecutionResponse,
#     summary="Execute task code",
#     description="Execute the code associated with a task (to be implemented)"
# )
# def execute_task_code(
#         task_id: int,
#         db: Session = Depends(get_db)
# ) -> CodeExecutionResponse:
#     """
#     Execute code for a specific task.
#
#     Note: The original implementation had security vulnerabilities
#     (SQL injection, raw code execution). This endpoint structure is
#     provided as a template. Implement proper code execution with:
#     - Sandboxing
#     - Input validation
#     - Resource limits
#     - Proper error handling
#     """
#     task = TaskService.get_task_by_id(db, task_id)
#
#     # TODO: Implement secure code execution
#     # Consider using:
#     # - Docker containers
#     # - Code execution services (e.g., Judge0, Piston)
#     # - Proper sandboxing libraries
#
#     raise HTTPException(
#         status_code=status.HTTP_501_NOT_IMPLEMENTED,
#         detail="Code execution is not yet implemented"
#     )
# @router.get("/topics/run_code/{task_id}")
# def task_run_code_manually(task_id: int):
#     data = None
#     try:
#         path = os.getenv('DATABASE_PATH')
#         conn = sqlite3.connect(path)
#         cursor = conn.cursor()
#         query = f"select * from tasks where id == {str(task_id)}"
#         data = cursor.execute(query)
#
#     except:
#         return "this code can`t be run"
#
#     return data
# #
#
#
#
