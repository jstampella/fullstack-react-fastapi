from app.config.database import get_db
from app.schemas.user import DecodeTokenResponse, UserLoginRequest, UserSchema
from app.services.user_services import login_user
from app.utils.jwt import decode_token, encode_token
from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.post(
    "/",
    tags=["auth"],
    response_model=UserSchema,
    description="Login user",
)
async def get_users_route(db: Session = Depends(get_db), user: UserLoginRequest = Body(...)):
    user_response = await login_user(user, db)
    token = encode_token(user_response)
    return UserSchema(id=user_response.id, name=user_response.name, email=user_response.email, token=token)


@router.get(
    "/{token}",
    tags=["auth"],
    response_model=DecodeTokenResponse,
    description="Decode Token user",
)
async def decode_token_route(token:str):
    user_response = decode_token(token)
    return DecodeTokenResponse(**user_response)