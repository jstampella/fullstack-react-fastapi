from app.config.database import get_db
from app.schemas.notebook import NotebookSchema, NotebookUpdateSchema
from app.services.notebook_services import create_notebook, delete_notebook, get_notebook_id, get_notebooks, update_notebook
from app.utils.middleware import verify_token
from fastapi import APIRouter, Body, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

router = APIRouter()


# POST
@router.post("/", tags=["notebooks"], response_model=NotebookSchema, description="Create a new disk",dependencies=[Depends(verify_token)])
async def create_notebook_route(db: Session = Depends(get_db), user: NotebookSchema = Body(...)):
    return await create_notebook(db, user)


# GET ALL
@router.get(
    "/",
    tags=["notebooks"],
    response_model=List[NotebookSchema],
    description="Get a list of all notebooks",
    dependencies=[Depends(verify_token)]
)
async def get_disks_route(db: Session = Depends(get_db)):
    return await get_notebooks(db)

# GET ID
@router.get(
    "/{id}",
    tags=["notebooks"],
    response_model=NotebookSchema,
    description="Get a single notebook by Id",
)
async def get_disk_route(id: str,db: Session = Depends(get_db)):
    return await get_notebook_id(id,db)

# DELETE ID
@router.delete(
    "/{id}",
    tags=["notebooks"],
    response_model=NotebookSchema,
    description="Delete a single notebook by Id",
)
async def get_disk_route(id: str,db: Session = Depends(get_db)):
    return await delete_notebook(id,db)


#PUT
@router.put(
    "/{id}", tags=["notebooks"], response_model=NotebookSchema, description="Update a notebooks by Id"
)
async def update_user_router(note: NotebookUpdateSchema, id: int,db: Session = Depends(get_db)):
    return await update_notebook(note, id, db)
