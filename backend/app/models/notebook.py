from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from app.config.database import engine
from sqlalchemy.orm import relationship

from app.models.disk import DiskModel

Base = declarative_base()

class NoteBookModel(Base):
    __tablename__ = "notebooks"
    id = Column(Integer, primary_key=True)
    marca = Column(String)
    modelo = Column(String)
    memoria = Column(String)
    disco_rigido_id = Column(Integer, ForeignKey(DiskModel.id))
    placa_video = Column(String)
    precio = Column(Float)

NoteBookModel.__table__.create(bind=engine, checkfirst=True)