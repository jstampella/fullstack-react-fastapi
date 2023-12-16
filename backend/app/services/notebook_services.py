from app.models.common import MiExcepcion
from app.models.notebook import NoteBookModel
from app.schemas.notebook import NotebookPaginationSchema, NotebookSchema, NotebookUpdateSchema
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from sqlalchemy import or_



async def create_notebook(db: Session, note: NotebookSchema):
    try:
        note_dict = note.dict()
        inserted_note = NoteBookModel(**note_dict)
        db.add(inserted_note)
        db.commit()
        db.refresh(inserted_note)
        if inserted_note is None: 
            raise MiExcepcion(code=404, mensaje="Notebook not created")
        return inserted_note
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


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
        return serialized_notebooks
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


async def get_notebook_id(id:int, db: Session):
    try:
        userSql = db.query(NoteBookModel).get(id)
        if userSql is None: 
            raise MiExcepcion(code=404, mensaje="Notebook not exist")
        return userSql
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


async def update_notebook(note: NotebookUpdateSchema, id: int, db: Session):
    try:
        noteSql = db.query(NoteBookModel).get(id)
        if noteSql is None:
            raise MiExcepcion(code=404, mensaje="Notebook not exist")
        update_data = note.dict(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                setattr(noteSql, key, value)
        db.commit()
        db.refresh(noteSql)
        return noteSql
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


async def delete_notebook(id: int, db: Session):
    try:
        obj_to_delete = db.query(NoteBookModel).get(id)
        if obj_to_delete is None: 
            raise MiExcepcion(code=404, mensaje="Notebook not exist")
        db.delete(obj_to_delete)
        db.commit()
        userExist = db.query(NoteBookModel).get(id)
        if userExist is not None:
            raise MiExcepcion(code=404, mensaje="Notebook not delete")
        return obj_to_delete
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)
    

async def search_notebook(params: NotebookUpdateSchema, db: Session):
    try:
        params_dict = params.dict(exclude_unset=True)
        params_filter = {k: v for k, v in params_dict.items() if v is not None and isinstance(v, str)}

        # Create filter condition depending on position of '%'
        def condition(k, v):
            if v.startswith('%'):
                return getattr(NoteBookModel, k).ilike(f"%{v[1:]}")
            elif v.endswith('%'):
                return getattr(NoteBookModel, k).ilike(f"{v[:-1]}%")
            elif v.startswith('%') and v.endswith('%'): 
                return getattr(NoteBookModel, k).ilike(f"%{v}%")
            else: 
                return getattr(NoteBookModel, k).ilike(f"{v}")

        notebooks = db.query(NoteBookModel).filter(
            or_(*[condition(k, v) for k, v in params_filter.items()])).all()

        serialized_notebooks = []
        for notebook in notebooks:
            notebook_dict = notebook.__dict__
            notebook_dict.pop('_sa_instance_state', None)
            serialized_notebooks.append(notebook_dict)
        return NotebookPaginationSchema(total=10, limit=5, page=0, data=list(serialized_notebooks))
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)