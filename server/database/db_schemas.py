from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


# ───────────────────────────────────────────────
# INPUT SCHEMAS
# ───────────────────────────────────────────────
class InputBase(BaseModel):
    input: str = Field(..., max_length=100)
    input_type: str = Field(..., max_length=50)


class InputCreate(InputBase):
    pass


class InputUpdate(BaseModel):
    input: Optional[str] = Field(None, max_length=100)
    input_type: Optional[str] = Field(None, max_length=50)


class InputResponse(InputBase):
    id: int
    input_output_id: int

    model_config = ConfigDict(from_attributes=True)


# ───────────────────────────────────────────────
# OUTPUT SCHEMAS
# ───────────────────────────────────────────────
class OutputBase(BaseModel):
    output: str = Field(..., max_length=100)
    output_type: str = Field(..., max_length=50)


class OutputCreate(OutputBase):
    pass


class OutputUpdate(BaseModel):
    output: Optional[str] = Field(None, max_length=100)
    output_type: Optional[str] = Field(None, max_length=50)


class OutputResponse(OutputBase):
    id: int
    input_output_id: int

    model_config = ConfigDict(from_attributes=True)


# ───────────────────────────────────────────────
# INPUT_OUTPUT SCHEMAS
# ───────────────────────────────────────────────
class InputOutputBase(BaseModel):
    pass


class InputOutputCreate(InputOutputBase):
    inputs: list[InputCreate] = []
    outputs: list[OutputCreate] = []


class InputOutputUpdate(BaseModel):
    inputs: Optional[list[InputCreate]] = None
    outputs: Optional[list[OutputCreate]] = None


class InputOutputResponse(InputOutputBase):
    id: int
    task_id: int
    inputs: list[InputResponse] = []
    outputs: list[OutputResponse] = []

    model_config = ConfigDict(from_attributes=True)


# ───────────────────────────────────────────────
# TASK SCHEMAS
# ───────────────────────────────────────────────
class TaskBase(BaseModel):
    name: str = Field(..., max_length=50)
    description: str
    topic: str = Field(..., max_length=50)
    type: bool = True  # True=train, False=refactor
    correct_code: str
    messed_code: str


class TaskCreate(TaskBase):
    input_outputs: list[InputOutputCreate] = []


class TaskUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    topic: Optional[str] = Field(None, max_length=50)
    type: Optional[bool] = None
    correct_code: Optional[str] = None
    messed_code: Optional[str] = None


class TaskResponse(TaskBase):
    id: int
    input_outputs: list[InputOutputResponse] = []

    model_config = ConfigDict(from_attributes=True)


# ───────────────────────────────────────────────
# SIMPLIFIED RESPONSE SCHEMAS (without nested data)
# ───────────────────────────────────────────────
class TaskSimpleResponse(TaskBase):
    """Task response without nested input_outputs"""
    id: int

    model_config = ConfigDict(from_attributes=True)


class InputOutputSimpleResponse(InputOutputBase):
    """InputOutput response without nested inputs/outputs"""
    id: int
    task_id: int

    model_config = ConfigDict(from_attributes=True)