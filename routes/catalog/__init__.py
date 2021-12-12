from fastapi import APIRouter
from . import book_routes, genre_router, order_routers

router = APIRouter(prefix='/catalog')
router.include_router(book_routes.router)
router.include_router(genre_router.router)
# router.include_router(order_routers.router)
