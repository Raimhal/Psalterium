from fastapi import APIRouter
from . import user_routers, role_routers

router = APIRouter()
router.include_router(user_routers.router)
router.include_router(role_routers.router)
