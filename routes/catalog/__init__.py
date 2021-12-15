from fastapi import APIRouter
from . import books, genres, orders

router = APIRouter(prefix='/catalog')
router.include_router(books.router)
router.include_router(genres.router)
router.include_router(orders.router)
