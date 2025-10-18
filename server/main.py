from fastapi import FastAPI
from database.db import engine
from database.db_models import Base
from backend.routers.tasks import router as tasks_router
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app = FastAPI(title="RefactoAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, etc.
    allow_headers=["*"],          # headers like Content-Type
)

# Create tables if not exist
Base.metadata.create_all(bind=engine)

# Include task router
app.include_router(tasks_router, tags=["Tasks"])

# Root route
@app.get("/", summary="Root endpoint")
def root():
    return {"message": "Welcome to RefactoAI!", "available_routes": ["/topics", "/topics/{topic}", "/topics/{topic}/task={id}"]}
