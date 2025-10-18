import sys
from pathlib import Path

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from server.database.db_models import *
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os


def create_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    load_dotenv()

    DATABASE_URL = os.getenv('DATABASE_URL')

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not found in environment variables!")
    try:
        engine = create_engine(DATABASE_URL, echo=True)
    except Exception as e:
        raise ValueError(f"❌ Failed to create engine: {e}")

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    create_db()