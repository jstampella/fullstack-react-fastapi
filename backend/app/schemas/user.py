from typing import Optional
from pydantic import BaseModel

class UserSchema(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    password: str


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

class DecodeTokenResponse(BaseModel):
    id: int
    name: str
    email: str