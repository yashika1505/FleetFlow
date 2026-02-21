import os
from pathlib import Path
from dotenv import load_dotenv

# Get the backend directory (parent of parent of this file)
backend_dir = Path(__file__).parent.parent.parent
env_path = backend_dir / ".env"

# Load .env file from the backend directory
load_dotenv(dotenv_path=env_path)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

_missing = [name for name, value in {
    "DB_USER": DB_USER,
    "DB_PASSWORD": DB_PASSWORD,
    "DB_NAME": DB_NAME,
}.items() if not value]

if _missing:
    missing = ", ".join(_missing)
    raise RuntimeError(
        f"Missing required database settings: {missing}. "
        "Set them in your environment or .env file."
    )

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)