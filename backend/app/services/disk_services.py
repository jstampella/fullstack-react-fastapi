
from app.models.disk import DiskModel
from app.schemas.disk import DiskSchema
from fastapi import HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse



async def create_disk(db: Session, disk: DiskSchema):
    inserted_disk = DiskModel(tipo=disk.tipo, tamanio=disk.tamanio, marca=disk.marca)
    db.add(inserted_disk)
    db.commit()
    db.refresh(inserted_disk)
    if inserted_disk is None: 
        raise HTTPException(status_code=404, detail="Disk not created")
    return inserted_disk


async def get_disks(db: Session):
    disks =  db.query(DiskModel).all()
    # Convert DiskModel instances to dictionaries excluding the InstanceState attribute
    serialized_disks = []
    for disk in disks:
        disk_dict = disk.__dict__
        disk_dict.pop('_sa_instance_state', None)
        serialized_disks.append(disk_dict)
    # Return the serialized_disks as a JSONResponse
    return JSONResponse(serialized_disks)


async def get_disk_id(id:int, db: Session):
    userSql = db.query(DiskModel).get(id)
    if userSql is None: 
        raise HTTPException(status_code=404, detail="Disk not exist")
    return userSql


async def update_disk(disk: DiskSchema, id: int, db: Session):
    userSql = db.query(DiskModel).get(id)

    userSql.tipo = disk.tipo
    userSql.tamanio = disk.tamanio
    userSql.marca = disk.marca
    db.commit()
    db.refresh(userSql)
    return userSql

