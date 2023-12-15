from psycopg2 import errors
from app.models.ErrorResponse import MiExcepcion
from app.models.notebook import NoteBookModel
from app.schemas.notebook import NotebookSchema, NotebookUpdateSchema
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi.responses import JSONResponse



async def create_notebook(db: Session, note: NotebookSchema):
    try:
        note_dict = note.dict()
        inserted_note = NoteBookModel(**note_dict)
        db.add(inserted_note)
        db.commit()
        db.refresh(inserted_note)
        if inserted_note is None: 
            raise HTTPException(status_code=404, detail="Notebook not created")
        return inserted_note
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(e,tipo_exc)


async def get_notebooks(db: Session):
    try:
        notebooks =  db.query(NoteBookModel).all()
        # Convert DiskModel instances to dictionaries excluding the InstanceState attribute
        serialized_notebooks = []
        for disk in notebooks:
            disk_dict = disk.__dict__
            disk_dict.pop('_sa_instance_state', None)
            serialized_notebooks.append(disk_dict)
        # Return the serialized_disks as a JSONResponse
        return JSONResponse(serialized_notebooks)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(e,tipo_exc)


async def get_notebook_id(id:int, db: Session):
    try:
        userSql = db.query(NoteBookModel).get(id)
        if userSql is None: 
            raise HTTPException(status_code=404, detail="Notebook not exist")
        return userSql
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(e,tipo_exc)


async def update_notebook(note: NotebookUpdateSchema, id: int, db: Session):
    try:
        print("###################################")
        noteSql = db.query(NoteBookModel).get(id)
        if noteSql is None:
            raise HTTPException(status_code=404, detail="Notebook not exist")
        update_data = note.dict(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                setattr(noteSql, key, value)
        db.commit()
        db.refresh(noteSql)
        return noteSql
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(e,tipo_exc)


async def delete_notebook(id: int, db: Session):
    try:
        obj_to_delete = db.query(NoteBookModel).get(id)
        db.delete(obj_to_delete)
        db.commit()
        userExist = db.query(NoteBookModel).get(id)
        return userExist
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(e,tipo_exc)