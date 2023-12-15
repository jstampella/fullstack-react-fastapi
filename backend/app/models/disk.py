from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from app.config.database import metadata, engine

Base = declarative_base()

class DiskModel(Base):
    __tablename__ = "disks"
    id = Column(Integer, primary_key=True)
    tipo = Column(String)
    tamanio = Column(String)
    marca = Column(String)


DiskModel.__table__.create(bind=engine, checkfirst=True)