from app.config.database import get_db
from app.schemas.user import DecodeToken, ExtendedUserSchema, UserLoginRequest, UserSchema
from app.services.user_services import create_user, login_user
from app.utils.jwt import decode_token, encode_token
from app.models.common import ResponseModel, create_response_model
from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.post(
    "/",
    tags=["auth"],
    response_model=create_response_model("AuthResponse", ExtendedUserSchema),
    description="Login user",
)
async def get_users_route(db: Session = Depends(get_db), user: UserLoginRequest = Body(...)):
    user_response = await login_user(user, db)
    token = encode_token(user_response)
    data = ExtendedUserSchema(id=user_response.id, name=user_response.name, email=user_response.email, token=token)
    return ResponseModel(status="success", data=data.dict(), message="User Login Successful", code=200) 


# POST
@router.post("/register", tags=["users"], response_model=create_response_model("RegisterResponse", ExtendedUserSchema), description="Create a new user")
async def create_user_route(db: Session = Depends(get_db), user: UserSchema = Body(...)):
    user_response = await create_user(db, user)
    token = encode_token(user_response)
    data = ExtendedUserSchema(id=user_response.id, name=user_response.name, email=user_response.email, token=token)
    return ResponseModel(status="success", data=data.dict(), message="User register Successful", code=201) 

@router.get(
    "/{token}",
    tags=["auth"],
    response_model=create_response_model("DecodeTokenResponse", DecodeToken),
    description="Decode Token user",
)
async def decode_token_route(token:str):
    user_response = decode_token(token)
    data =  DecodeToken(**user_response)
    return ResponseModel(status="success", data=data.dict(), message="Decode Token Successful", code=200)