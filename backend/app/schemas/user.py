from typing import Optional
from pydantic import BaseModel, BaseConfig

class UserSchema(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    password: str
    token: Optional[str] = None

class ExtendedUserSchema(UserSchema):
    password: Optional[str] = None


class UserCount(BaseModel):
    total: int

class UserLoginResponse(BaseModel):
    id: int
    name: str
    email: str
    token:str

class UserLoginRequest(BaseModel):
    password: str
    email: str

class DecodeToken(BaseModel):
    id: int
    name: str
    email: str