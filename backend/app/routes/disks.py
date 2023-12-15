from app.config.database import get_db
from app.schemas.disk import DiskSchema
from app.services.disk_services import create_disk, get_disk_id, get_disks, update_disk
from app.utils.middleware import verify_token
from fastapi import APIRouter, Body, Depends
from typing import List
from sqlalchemy.orm import Session

router = APIRouter()

# GET ALL
@router.get(
    "/",
    tags=["disks"],
    response_model=List[DiskSchema],
    description="Get a list of all disks",
    dependencies=[Depends(verify_token)]
)
async def get_disks_route(db: Session = Depends(get_db)):
    return await get_disks(db)

# GET ID
@router.get(
    "/{id}",
    tags=["disks"],
    response_model=DiskSchema,
    description="Get a single disk by Id",
    dependencies=[Depends(verify_token)]
)
async def get_disk_route(id: str,db: Session = Depends(get_db)):
    return await get_disk_id(id,db)

# POST
@router.post("/", tags=["disks"], response_model=DiskSchema, description="Create a new disk", dependencies=[Depends(verify_token)])
async def create_disk_route(db: Session = Depends(get_db), user: DiskSchema = Body(...)):
    return await create_disk(db, user)

#PUT
@router.put(
    "/{id}", tags=["disks"], response_model=DiskSchema, description="Update a Disk by Id", dependencies=[Depends(verify_token)]
)
async def update_user_router(disk: DiskSchema, id: int,db: Session = Depends(get_db)):
    return await update_disk(disk, id, db)
