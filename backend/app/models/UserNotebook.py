from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from app.config.database import engine
from app.models.user import UserModel
from app.models.notebook import NoteBookModel
from sqlalchemy.orm import declared_attr
from sqlalchemy.orm import relationship

Base = declarative_base()

class UserNotebookModel(Base):
    __tablename__ = "userNotebook"
    @declared_attr
    def user_id(cls):
        return Column(Integer, ForeignKey(UserModel.id), primary_key=True)
    
    @declared_attr
    def notebook_id(cls):
        return Column(Integer, ForeignKey(NoteBookModel.id), primary_key=True)
    
    # Definir la relación con UserModel
    user = relationship(UserModel, single_parent=True, cascade="all, delete-orphan")
    # Definir la relación con NoteBookModel
    notebook = relationship(NoteBookModel, single_parent=True, cascade="all, delete-orphan")

UserNotebookModel.__table__.create(bind=engine, checkfirst=True)