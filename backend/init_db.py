import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.db.base import Base
from app.db.session import engine
from app.db.models import User

def main():
    print("[INIT] Connecting to Supabase PostgreSQL Session Pooler...")
    try:
        Base.metadata.create_all(bind=engine)
        print("[SUCCESS] Auth tables (users) successfully created and verified on Supabase PostgreSQL!")
    except Exception as e:
        print(f"[ERROR] Failed to create tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
