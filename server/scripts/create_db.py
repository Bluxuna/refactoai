import sys
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Add parent directory to path for imports
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from database.db_models import Base  # make sure you import Base here

def create_db(engine):
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    load_dotenv()

    DATABASE_URL = os.getenv('DATABASE_URL')
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not found in environment variables!")

    # Handle spaces in path correctly
    if DATABASE_URL.startswith("sqlite:///"):
        path_part = DATABASE_URL.replace("sqlite:///", "")
        path_obj = Path(path_part)
        path_obj.parent.mkdir(parents=True, exist_ok=True)
        DATABASE_URL = f"sqlite:///{path_obj.as_posix()}"

    try:
        engine = create_engine(DATABASE_URL, echo=True)
    except Exception as e:
        raise ValueError(f"❌ Failed to create engine: {e}")

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    create_db(engine)
    print("✅ Database created successfully!")
