from app.config.database import get_db
from app.schemas.notebook import NotebookPaginationSchema, NotebookSchema, NotebookSearchSchema, NotebookUpdateSchema
from app.services.notebook_services import create_notebook, delete_notebook, get_notebook_id, get_notebooks, search_notebook, update_notebook
from app.utils.middleware import verify_token
from app.models.common import ResponseModel, create_response_model
from app.schemas.user import DecodeToken
from fastapi import APIRouter, Body, Depends, Request
from typing import List
from sqlalchemy.orm import Session

router = APIRouter()


# POST
@router.post("/", tags=["notebooks"], response_model=create_response_model("NotebookResponse", NotebookSchema), description="Create a new notebook",dependencies=[Depends(verify_token)])
async def create_notebook_route(token: DecodeToken = Depends(verify_token), db: Session = Depends(get_db), note: NotebookSchema = Body(...)):
    data = await create_notebook(db, note, token)
    return ResponseModel(status="success", data=data, message="Create Notebook Successful", code=201) 


# GET ALL
@router.get(
    "/",
    tags=["notebooks"],
    response_model=create_response_model("NotebookAllResponse", List[NotebookSchema]),
    description="Get a list of all notebooks",
    dependencies=[Depends(verify_token)]
)
async def get_disks_route(db: Session = Depends(get_db)):
    data = await get_notebooks(db)
    return ResponseModel(status="success", data=list(data), message="List Notebooks Successful", code=200)


# GET ALL
@router.get(
    "/user",
    tags=["notebooks"],
    response_model=create_response_model("NotebookAllResponse", List[NotebookSchema]),
    description="Get a list of all notebooks",
    dependencies=[Depends(verify_token)]
)
async def get_disks_route(token: str = Depends(verify_token), db: Session = Depends(get_db)):
    data = await get_notebooks(db, token)
    return ResponseModel(status="success", data=list(data), message="List Notebooks Successful", code=200)



#GET SEARCH
@router.get(
    "/search", tags=["notebooks"],response_model=create_response_model("NotebookAllResponse", NotebookPaginationSchema), description="Search a notebooks by Params", dependencies=[Depends(verify_token)]
)
async def update_user_router(request: Request,db: Session = Depends(get_db)):
    params = dict(request.query_params)
    prm = NotebookSearchSchema(**params)
    data = await search_notebook(prm, db)
    return ResponseModel(status="success", data=data, message="Search a notebooks by Params Successful", code=200)


# GET ID
@router.get(
    "/{id}",
    tags=["notebooks"],
    response_model=create_response_model("NotebookResponse", NotebookSchema),
    description="Get a single notebook by Id",
    dependencies=[Depends(verify_token)]
)
async def get_disk_route(id: str,db: Session = Depends(get_db)):
    data = await get_notebook_id(id,db)
    return ResponseModel(status="success", data=data, message="Notebook by ID Successful", code=200)

# DELETE ID
@router.delete(
    "/{id}",
    tags=["notebooks"],
    description="Delete a single notebook by Id",
    response_model=create_response_model("NotebookResponse", NotebookSchema),
    dependencies=[Depends(verify_token)]
)
async def get_disk_route(id: str,db: Session = Depends(get_db)):
    data = await delete_notebook(id,db)
    return ResponseModel(status="success", data=data, message="Notebook by ID Delete Successful", code=204)

#PUT
@router.put(
    "/{id}", tags=["notebooks"], response_model=create_response_model("NotebookResponse", NotebookSchema), description="Update a notebooks by Id", dependencies=[Depends(verify_token)]
)
async def update_user_router(note: NotebookUpdateSchema, id: int,db: Session = Depends(get_db)):
    data = await update_notebook(note, id, db)
    return ResponseModel(status="success", data=data, message="Updated Notebook Successful", code=200)