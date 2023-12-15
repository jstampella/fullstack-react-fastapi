from app.config.database import get_db
from app.services.user_services import create_user, delete_user, get_users, update_user
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
    response_model=List[UserSchema],
    description="Get a list of all users",
    dependencies=[Depends(verify_token)]
)
async def get_users_route(db: Session = Depends(get_db)):
    return await get_users(db)


# GET COUNT
@router.get("/count", tags=["users"], response_model=UserCount,  dependencies=[Depends(verify_token)])
async def get_users_count(db: Session = Depends(get_db)):
    result = db.execute(select([func.count()]).select_from(UserModel))
    return {"total": tuple(result)[0][0]}

# GET ID
@router.get(
    "/{id}",
    tags=["users"],
    response_model=UserSchema,
    description="Get a single user by Id",
    dependencies=[Depends(verify_token)]
)
def get_user(id: str,db: Session = Depends(get_db)):
    return db.execute(UserModel.select().where(UserModel.c.id == id)).first()

# POST
@router.post("/", tags=["users"], response_model=UserSchema, description="Create a new user", dependencies=[Depends(verify_token)])
async def create_user_route(db: Session = Depends(get_db), user: UserSchema = Body(...)):
    return await create_user(db, user)

# PUT
@router.put(
    "/{id}", tags=["users"], response_model=UserSchema, description="Update a User by Id", dependencies=[Depends(verify_token)]
)
async def update_user_router(user: UserSchema, id: int,db: Session = Depends(get_db)):
    return await update_user(user, id, db)

# DELETE
@router.delete("/{id}", tags=["users"], description="Delete a User by Id", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(verify_token)])
async def delete_user_route(id: int, db: Session = Depends(get_db)):
    return await delete_user(id, db)