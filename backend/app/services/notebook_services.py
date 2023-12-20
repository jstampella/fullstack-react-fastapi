from typing import Optional
from app.models.common import MiExcepcion
from app.models.notebook import NoteBookModel
from app.models.UserNotebook import UserNotebookModel
from app.models.user import UserModel
from app.schemas.notebook import NotebookPaginationSchema, NotebookSchema, NotebookUpdateSchema
from sqlalchemy.orm import Session
from app.schemas.user import DecodeToken
from sqlalchemy import or_, desc
import types

from app.utils.helpers import safe_int


async def create_notebook(db: Session, note: NotebookSchema,  token: DecodeToken):
    try:
        note_dict = note.dict()
        token_obj = types.SimpleNamespace(**token)
        userSql = db.query(UserModel).filter_by(email=token_obj.email).first()
        if userSql is None: 
            raise MiExcepcion(code=404, mensaje="Error en el Token al crear notebook")
        inserted_note = NoteBookModel(**note_dict)
        db.add(inserted_note)
        db.commit()
        relation_insert = UserNotebookModel(user_id=userSql.id, notebook_id=inserted_note.id)
        db.add(relation_insert)
        db.commit()
        db.refresh(inserted_note)
        if inserted_note is None: 
            raise MiExcepcion(code=404, mensaje="Notebook not created")
        return inserted_note
    except MiExcepcion as e:
        db.rollback()
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        db.rollback()
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


async def get_notebooks(db: Session, token: Optional[DecodeToken] = None):
    try:
        if token is None:
            notebooks =  db.query(NoteBookModel).all()
        else:
            token_obj = types.SimpleNamespace(**token)
            print(token_obj)
            userSql = db.query(UserModel).filter_by(email=token_obj.email).first()
            if userSql is None: 
                raise MiExcepcion(code=404, mensaje="Error en el Token al listar notebooks")
            list_notebook_id =  db.query(UserNotebookModel).filter_by(user_id=userSql.id).all()
            notebook_ids = [notebook.notebook_id for notebook in list_notebook_id]
            # Obtener los objetos NoteBookModel
            notebooks = db.query(NoteBookModel).filter(NoteBookModel.id.in_(notebook_ids)).order_by(desc(NoteBookModel.id)).all()
            notebooks = notebooks[:4]
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

        print(params_dict)
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
            
        params_filter.pop('limit', None)  # Default to None if 'limit' is not in params_filter
        params_filter.pop('page', None)  # Default to None if 'page' is not in params_filter
        limit = params_dict.get('limit')
        page = params_dict.get('page')

        limit_default = 5  # Valor predeterminado para limit si no se proporciona
        page_default = 0   # Valor predeterminado para page si no se proporciona

        # Convertir limit y page a enteros de manera segura
        limit_int = safe_int(limit, limit_default)
        page_int = safe_int(page, page_default)

        # Calcular start y end para la paginación
        start = page_int * limit_int
        end = start + limit_int if limit_int is not None else None
        
        notebooks = db.query(NoteBookModel).filter(
            or_(*[condition(k, v) for k, v in params_filter.items()]))
        
        total = notebooks.count()

        # Apply pagination if start and end are set
        if start is not None and end is not None:
            notebooks = notebooks.slice(start, end)

        notebooks = notebooks.all()

        serialized_notebooks = []
        for notebook in notebooks:
            notebook_dict = notebook.__dict__
            notebook_dict.pop('_sa_instance_state', None)
            serialized_notebooks.append(notebook_dict)
        
        return NotebookPaginationSchema(total=total, limit=limit_int, page=page_int, data=list(serialized_notebooks))
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)