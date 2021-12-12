from typing import List

from fastapi import APIRouter, Depends
from starlette import status

from config.db import Session
from models import models
from schemas import schemas
from services import generalServices, bookServices
from config.dependencies import get_db, get_current_user

router = APIRouter(prefix='/books', tags=['books'])

@router.get('', response_model=List[schemas.BookDto])
async def get_books(skip: int=0, limit: int=10, db: Session = Depends(get_db),
                    current_user: models.User = Depends(get_current_user)):
    expression = models.Book.owner == current_user
    return generalServices.get_all(db=db, model=models.Book, skip=skip, limit=limit, current_user=current_user, expression=expression)


@router.get('/{id:int}', response_model=schemas.Book)
async def get_book(id: int, db: Session = Depends(get_db),
                         current_user: models.User = Depends(get_current_user)):
    model = models.Book
    expression = model.id == id
    return generalServices.get_by_expression(db=db, model=model, expression=expression)


@router.post('', response_model=int)
async def create_book(bookCreate: schemas.BookCreate, db: Session = Depends(get_db),
                      current_user: models.User = Depends(get_current_user)):
    return bookServices.create_book(db=db, model=bookCreate, current_user=current_user)


@router.put('/{id:int}/update', status_code=status.HTTP_204_NO_CONTENT)
async def update_book(id: int, bookUpdate: schemas.BookCreate, db: Session = Depends(get_db),
                            current_user: models.User = Depends(get_current_user)):
    model = models.Book
    expression = model.id == id
    book = generalServices.get_by_expression(db=db, model=model, expression=expression)
    bookServices.update_book(db=db, book=book, model=bookUpdate)


@router.patch('/{id:int}/set_genres', status_code=status.HTTP_204_NO_CONTENT)
async def set_genres(id: int, genres: List[schemas.GenreBase], db: Session = Depends(get_db),
                            current_user: models.User = Depends(get_current_user)):
    model = models.Book
    expression = model.id == id
    book = generalServices.get_by_expression(db=db, model=model, expression=expression)
    bookServices.set_genres(db=db, book=book, genres=genres)


@router.delete('/{id}/delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(id: int, db: Session = Depends(get_db),
                            current_user: models.User = Depends(get_current_user)):
    generalServices.delete(db=db, model=models.Book, id=id)

