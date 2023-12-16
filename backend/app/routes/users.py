from app.config.database import get_db
from app.services.user_services import create_user, delete_user, get_users, update_user
from app.models.common import ResponseModel, create_response_model
from fastapi import APIRouter, Body, Depends, status
from app.models.user import UserModel
from app.schemas.user import UserSchema, UserCount
from typing import List
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.utils.middleware import verify_token


router = APIRouter()

# GET ALL
@router.get(
    "/",
    tags=["users"],
    response_model=create_response_model("UsersAllResponse", List[UserSchema]),
    description="Get a list of all users",
    dependencies=[Depends(verify_token)]
)
async def get_users_route(db: Session = Depends(get_db)):
    data = await get_users(db)
    return ResponseModel(status="success", data=list(data), message="List Users Successful", code=200)


# GET COUNT
@router.get("/count", tags=["users"], response_model=create_response_model("UsersCountResponse", UserCount), description="Count users", dependencies=[Depends(verify_token)])
async def get_users_count(db: Session = Depends(get_db)):
    result = db.execute(select([func.count()]).select_from(UserModel))
    data =  {"total": tuple(result)[0][0]}
    return ResponseModel(status="success", data=list(data), message="Users Count Successful", code=200)

# GET ID
@router.get(
    "/{id}",
    tags=["users"],
    response_model=create_response_model("UsersResponse", UserSchema),
    description="Get a single user by Id",
    dependencies=[Depends(verify_token)]
)
def get_user(id: str,db: Session = Depends(get_db)):
    data = db.execute(UserModel.select().where(UserModel.c.id == id)).first()
    return ResponseModel(status="success", data=data, message="User Successful", code=200)

# POST
@router.post("/", tags=["users"], response_model=create_response_model("UsersResponse", UserSchema), description="Create a new user", dependencies=[Depends(verify_token)])
async def create_user_route(db: Session = Depends(get_db), user: UserSchema = Body(...)):
    data = await create_user(db, user)
    return ResponseModel(status="success", data=data, message="Create User Successful", code=201)

# PUT
@router.put(
    "/{id}", tags=["users"], response_model=create_response_model("UsersResponse", UserSchema), description="Update a User by Id", dependencies=[Depends(verify_token)]
)
async def update_user_router(user: UserSchema, id: int,db: Session = Depends(get_db)):
    data = await update_user(user, id, db)
    return ResponseModel(status="success", data=data, message="Updated User Successful", code=201)

# DELETE
@router.delete("/{id}", tags=["users"], description="Delete a User by Id", response_model=create_response_model("UsersResponse", UserSchema), dependencies=[Depends(verify_token)])
async def delete_user_route(id: int, db: Session = Depends(get_db)):
    data = await delete_user(id, db)
    return ResponseModel(status="success", data=data, message="Delete User Successful", code=200)