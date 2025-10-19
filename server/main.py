from fastapi import FastAPI
from database.db import engine
from database.db_models import Base
from backend.routers.routes import app as router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RefactoAI Backend")

origins = [
    "http://localhost:8080"
]

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
app.include_router(router, tags=["Tasks"])

# Root route
@app.get("/", summary="Root endpoint")
def root():
    return {"message": "Welcome to RefactoAI!", "available_routes": ["/topics", "/topics/{topic}", "/topics/{topic}/task={id}"]}
