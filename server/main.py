from fastapi import FastAPI
from database.db import engine
from database.db_models import Base
from backend.routers.routes import app as router

app = FastAPI(title="RefactoAI Backend")

# Create tables if not exist
Base.metadata.create_all(bind=engine)

# Include task router
app.include_router(router, tags=["Tasks"])

# Root route
@app.get("/", summary="Root endpoint")
def root():
    return {"message": "Welcome to RefactoAI!", "available_routes": ["/topics", "/topics/{topic}", "/topics/{topic}/task={id}"]}
