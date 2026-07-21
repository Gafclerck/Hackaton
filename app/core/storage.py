from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads" / "dossiers"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "text/plain",
    "image/jpeg",
    "image/png",
]