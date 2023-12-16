from app.config.database import get_db
from app.schemas.disk import DiskSchema
from app.services.disk_services import create_disk, get_disk_id, get_disks, update_disk
from app.utils.middleware import verify_token
from app.models.common import ResponseModel, create_response_model
from fastapi import APIRouter, Body, Depends
from typing import List
from sqlalchemy.orm import Session

router = APIRouter()

# GET ALL
@router.get(
    "/",
    tags=["disks"],
    response_model=create_response_model("DisksAllResponse", List[DiskSchema]),
    description="Get a list of all disks",
    dependencies=[Depends(verify_token)]
)
async def get_disks_route(db: Session = Depends(get_db)):
    data = await get_disks(db)
    return ResponseModel(status="success", data=list(data), message="List Disks Successful", code=200)


# GET ID
@router.get(
    "/{id}",
    tags=["disks"],
    response_model=create_response_model("DiskResponse", DiskSchema),
    description="Get a single disk by Id",
    dependencies=[Depends(verify_token)]
)
async def get_disk_route(id: str,db: Session = Depends(get_db)):
    data = await get_disk_id(id,db)
    return ResponseModel(status="success", data=data, message="Disk id Successful", code=200)

# POST
@router.post("/", tags=["disks"], response_model=create_response_model("DiskResponse", DiskSchema), description="Create a new disk", dependencies=[Depends(verify_token)])
async def create_disk_route(db: Session = Depends(get_db), user: DiskSchema = Body(...)):
    data = await create_disk(db, user)
    return ResponseModel(status="success", data=data, message="Create Disk Successful", code=201)

#PUT
@router.put(
    "/{id}", tags=["disks"], response_model=create_response_model("DiskResponse", DiskSchema), description="Update a Disk by Id", dependencies=[Depends(verify_token)]
)
async def update_user_router(disk: DiskSchema, id: int,db: Session = Depends(get_db)):
    data = await update_disk(disk, id, db)
    return ResponseModel(status="success", data=data, message="Updated Disk Successful", code=200)
