from app.models.ErrorResponse import MiExcepcion
from app.models.user import UserModel
from app.schemas.user import UserSchema
from app.utils.jwt import decript_pass, encript_pass
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse



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
        data = [{k: v for k, v in u.__dict__.items() if k != '_sa_instance_state' and k != 'password'} for u in users]
        # Devuelve el objeto serializable
        return JSONResponse(data)
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
        return userExist
    except MiExcepcion as e:
        raise MiExcepcion(**e.__dict__)
    except Exception as e:
        tipo_exc = type(e).__name__
        raise MiExcepcion(error=e, mensaje=tipo_exc)

async def login_user(user: UserSchema, db: Session):
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