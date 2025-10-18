from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.deps import get_db
from database.db_models import Task, InputOutput
from database.db_schemas import InputOutputResponse, InputResponse, OutputResponse

router = APIRouter()

@router.get("/tasks/{task_id}/io", response_model=list[InputOutputResponse])
def list_task_io(task_id: int, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    groups = db.scalars(
        select(InputOutput).where(InputOutput.task_id == task_id)
    ).all()
    payload = []
    for g in groups:
        payload.append(
            InputOutputResponse(
                id=g.id,
                task_id=g.task_id,
                inputs=[InputResponse(
                    id=i.id, input=i.input, input_type=i.input_type,
                    input_output_id=i.input_output_id
                ) for i in (g.inputs or [])],
                outputs=[OutputResponse(
                    id=o.id, output=o.output, output_type=o.output_type,
                    input_output_id=o.input_output_id
                ) for o in (g.outputs or [])],
            )
        )
    return payload
