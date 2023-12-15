from app.models.user import UserModel
from app.schemas.user import UserLoginResponse, UserSchema
from app.utils.jwt import decript_pass, encript_pass
from fastapi import HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse



async def create_user(db: Session, user: UserSchema):
    userExist = db.query(UserModel).filter(UserModel.email==user.email).first()
    if userExist is not None:
        raise HTTPException(status_code=409, detail="El email ya se encuentra registrado")
    encrypted_password_str = encript_pass(user.password)
    inserted_user = UserModel(name= user.name, email= user.email, password= encrypted_password_str)
    db.add(inserted_user)
    db.commit()
    db.refresh(inserted_user)
    if inserted_user is None: 
        raise HTTPException(status_code=404, detail="User not created")
    return inserted_user


async def get_users(db: Session):
    users =  db.query(UserModel).all()
    # Convertir Row a Diccionario y excluir la contraseña
    data = [{k: v for k, v in u.__dict__.items() if k != '_sa_instance_state' and k != 'password'} for u in users]
    # Devuelve el objeto serializable
    return JSONResponse(data)


async def update_user(user: UserSchema, id: int, db: Session):
    userSql = db.query(UserModel).get(id)
    encrypted_password_str = encript_pass(user.password)
    # Actualizar las propiedades del usuario utilizando la propagación
    userSql.name = user.name
    userSql.email = user.email
    userSql.password = encrypted_password_str
    db.commit()
    db.refresh(userSql)
    return userSql



async def delete_user(id: int, db: Session):
    obj_to_delete = db.query(UserModel).get(id)
    db.delete(obj_to_delete)
    db.commit()
    userExist = db.query(UserModel).get(id)
    return userExist


async def login_user(user: UserLoginResponse, db: Session):
    # Desencripta la contraseña almacenada
    user_result = db.query(UserModel).filter_by(email=user.email).first()
    if user_result is None: 
        raise HTTPException(status_code=404, detail="El mail no esta registrado")
    decrypted_password = decript_pass(user_result.password)
    # Compara el password almacenado con el del usuario
    if user.password != decrypted_password:
        raise HTTPException(status_code=404, detail="Password incorrecto")
    db.commit()
    return user_result