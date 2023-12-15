from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from app.config.database import metadata, engine

Base = declarative_base()

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)

UserModel.__table__.create(bind=engine, checkfirst=True)