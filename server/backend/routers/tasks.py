from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from backend.deps import get_db
from database.db_models import Task, InputOutput
from database.db_schemas import (
    TaskSimpleResponse, TaskResponse,
    InputOutputResponse, InputResponse, OutputResponse
)

router = APIRouter()  # no prefix, so routes work alongside "/"


# --- Helpers to serialize ORM -> Pydantic ---
def to_task_simple(task: Task) -> TaskSimpleResponse:
    return TaskSimpleResponse(
        id=task.id,
        name=task.name,
        description=task.description,
        topic=task.topic,
        type=True,  # default since not stored in DB
        correct_code=task.correct_code,
        messed_code=task.messed_code
    )


def to_task_full(task: Task) -> TaskResponse:
    ios: list[InputOutputResponse] = []
    for g in task.input_outputs or []:
        ios.append(
            InputOutputResponse(
                id=g.id,
                task_id=g.task_id,
                inputs=[
                    InputResponse(
                        id=i.id,
                        input=i.input,
                        input_type=i.input_type,
                        input_output_id=i.input_output_id
                    ) for i in (g.inputs or [])
                ],
                outputs=[
                    OutputResponse(
                        id=o.id,
                        output=o.output,
                        output_type=o.output_type,
                        input_output_id=o.input_output_id
                    ) for o in (g.outputs or [])
                ],
            )
        )

    return TaskResponse(
        id=task.id,
        name=task.name,
        description=task.description,
        topic=task.topic,
        type=True,
        correct_code=task.correct_code,
        messed_code=task.messed_code,
        input_outputs=ios
    )


# ───────────────────────────────────────────────
# ROUTES
# ───────────────────────────────────────────────

# /topics  → list all unique topics
@router.get("/topics", summary="List all available topics")
def list_topics(db: Session = Depends(get_db)):
    rows = db.execute(select(func.distinct(Task.topic))).all()
    return {"topics": [r[0] for r in rows]}


# /topics/{topic}  → all tasks in a topic
@router.get("/topics/{topic}", summary="List tasks under a topic")
def tasks_in_topic(topic: str, db: Session = Depends(get_db)):
    items = db.scalars(select(Task).where(Task.topic == topic)).all()
    return {"items": [to_task_simple(t) for t in items], "total": len(items)}


# /topics/{topic}/task={id}  → single task by topic and ID
@router.get("/topics/{topic}/task={task_id}", response_model=TaskSimpleResponse, summary="Get single task")
def task_by_topic_and_id(topic: str, task_id: int, db: Session = Depends(get_db)):
    t = db.scalars(select(Task).where(Task.id == task_id, Task.topic == topic)).first()
    if not t:
        raise HTTPException(404, "Task not found")
    return to_task_simple(t)
