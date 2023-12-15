from fastapi import APIRouter
from . import users, auth, notebooks, disks

router = APIRouter()

router.include_router(users.router, prefix="/users")
router.include_router(notebooks.router, prefix="/notebook")
router.include_router(disks.router, prefix="/disks")
router.include_router(auth.router, prefix="/auth")