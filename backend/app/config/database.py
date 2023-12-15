import os
from sqlalchemy import (Column, DateTime, Integer, MetaData, String, Table, create_engine)
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker, Session
from databases import Database

DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

metadata = MetaData()
database = Database(DATABASE_URL)

def get_db():
    db = SessionLocal()
    try:
       yield db
    finally:
        db.close()