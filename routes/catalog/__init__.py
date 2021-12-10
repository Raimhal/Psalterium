from fastapi import APIRouter
from . import book_routes

router = APIRouter(prefix='/catalog')
router.include_router(book_routes.router)
