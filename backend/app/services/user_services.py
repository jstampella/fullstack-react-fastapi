from app.models.common import MiExcepcion
from app.models.user import UserModel
from app.schemas.user import ExtendedUserSchema, UserSchema
from app.utils.jwt import decript_pass, encript_pass
from sqlalchemy.orm import Session



async def create_user(db: Session, user: UserSchema):
    try:
        userExist = db.query(UserModel).filter(UserModel.email==user.email).first()
        if userExist is not None:
            raise MiExcepcion(code=409, mensaje="El email ya se encuentra registrado")
        encrypted_password_str = encript_pass(user.password)
        inserted_user = UserModel(name= user.name, email= user.email, password= encrypted_password_str)
        db.add(inserted_user)
        db.commit()
        db.refresh(inserted_user)
        if inserted_user is None: 
            raise MiExcepcion(code=404, mensaje="User not created")
        return inserted_user
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


async def get_users(db: Session):
    try:
        users =  db.query(UserModel).all()
        # Convertir Row a Diccionario y excluir la contraseña
        serialized_users = []
        for disk in users:
            disk_dict = disk.__dict__
            disk_dict.pop('_sa_instance_state', None)
            serialized_users.append(disk_dict)
        return serialized_users
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)

async def update_user(user: UserSchema, id: int, db: Session):
    try:
        userSql = db.query(UserModel).get(id)
        encrypted_password_str = encript_pass(user.password)
        # Actualizar las propiedades del usuario utilizando la propagación
        userSql.name = user.name
        userSql.email = user.email
        userSql.password = encrypted_password_str
        db.commit()
        db.refresh(userSql)
        return userSql
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)


async def delete_user(id: int, db: Session):
    try:
        obj_to_delete = db.query(UserModel).get(id)
        db.delete(obj_to_delete)
        db.commit()
        userExist = db.query(UserModel).get(id)
        if userExist is not None:
            raise MiExcepcion(mensaje="User not Delete", code=400)
        return obj_to_delete
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)

async def login_user(user: ExtendedUserSchema, db: Session):
    try:
        # Desencripta la contraseña almacenada
        user_result = db.query(UserModel).filter_by(email=user.email).first()
        if user_result is None: 
            raise MiExcepcion(code=404, mensaje="El mail no esta registrado")
        decrypted_password = decript_pass(user_result.password)
        # Compara el password almacenado con el del usuario
        if user.password != decrypted_password:
            raise MiExcepcion(code=404, mensaje="Password incorrecto")
        db.commit()
        return user_result
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)