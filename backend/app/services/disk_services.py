
from app.models.ErrorResponse import MiExcepcion
from app.models.disk import DiskModel
from app.schemas.disk import DiskSchema
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse



async def create_disk(db: Session, disk: DiskSchema):
    try:
        inserted_disk = DiskModel(tipo=disk.tipo, tamanio=disk.tamanio, marca=disk.marca)
        db.add(inserted_disk)
        db.commit()
        db.refresh(inserted_disk)
        if inserted_disk is None: 
            raise MiExcepcion(code=404, mensaje="Disk not created")
        return inserted_disk
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


async def get_disks(db: Session):
    try:
        disks =  db.query(DiskModel).all()
        # Convert DiskModel instances to dictionaries excluding the InstanceState attribute
        serialized_disks = []
        for disk in disks:
            disk_dict = disk.__dict__
            disk_dict.pop('_sa_instance_state', None)
            serialized_disks.append(disk_dict)
        # Return the serialized_disks as a JSONResponse
        return JSONResponse(serialized_disks)
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


async def get_disk_id(id:int, db: Session):
    try:
        userSql = db.query(DiskModel).get(id)
        if userSql is None: 
            raise MiExcepcion(code=404, mensaje="Disk not exist")
        return userSql
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)

async def update_disk(disk: DiskSchema, id: int, db: Session):
    try:
        userSql = db.query(DiskModel).get(id)
        userSql.tipo = disk.tipo
        userSql.tamanio = disk.tamanio
        userSql.marca = disk.marca
        db.commit()
        db.refresh(userSql)
        return userSql
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)

