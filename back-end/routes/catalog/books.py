from typing import List, Optional

from fastapi import APIRouter, Depends, UploadFile, File
from starlette import status

from config.db import Session
from models import models
from schemas import schemas
from services import generalServices, bookServices
from config.dependencies import get_db, get_current_user

router = APIRouter(prefix='/books', tags=['books'])

_model = models.Book


@router.get('', response_model=List[schemas.BookDto])
async def get_books(skip: int=0, limit: int=10, db: Session = Depends(get_db)):
    return generalServices.get_all(db=db, model=_model, skip=skip, limit=limit)


@router.get('/search', response_model=List[schemas.BookDto])
async def get_books(select: str, skip: int=0, limit: int=10, db: Session = Depends(get_db)):
    expression = _model.name.contains(select.lower())
    return generalServices.get_all_with_expression(db=db, model=_model, skip=skip, limit=limit, expression=expression)


@router.get('/my', response_model=List[schemas.BookDto])
async def get_books(skip: int=0, limit: int=10, db: Session = Depends(get_db),
                    current_user: models.User = Depends(get_current_user)):
    expression = _model.owner == current_user
    return generalServices.get_all_with_expression(db=db, model=_model, skip=skip, limit=limit, expression=expression)


@router.get('/{id:int}', response_model=schemas.Book)
async def get_book(id: int, db: Session = Depends(get_db)):
    expression = _model.id == id
    return generalServices.get_by_expression(db=db, model=_model, expression=expression)


@router.get("/{id:int}/image", status_code=status.HTTP_200_OK)
async def get_image(id: int, db: Session = Depends(get_db)):
    print('ok')
    return bookServices.get_image(db=db, id=id)


@router.post('', response_model=int)
async def create_book(bookCreate: schemas.BookCreate,db: Session = Depends(get_db),
                      current_user: models.User = Depends(get_current_user)):
    return bookServices.create_book(db=db, model=bookCreate, current_user=current_user)


@router.put('/{id:int}/update', status_code=status.HTTP_204_NO_CONTENT)
async def update_book(id: int, bookUpdate: schemas.BookCreate,
                      db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    expression = _model.id == id
    bookServices.update_book(db=db, model=bookUpdate, expression=expression)


@router.patch('/{id:int}/set_genres', status_code=status.HTTP_204_NO_CONTENT)
async def set_genres(id: int, genres: List[schemas.GenreBase], db: Session = Depends(get_db),
                            current_user: models.User = Depends(get_current_user)):
    expression = _model.id == id
    bookServices.set_genres(db=db, genres=genres, expression=expression)


@router.patch('/{id:int}/change_image', status_code=status.HTTP_204_NO_CONTENT)
async def change_image(id: int, db: Session = Depends(get_db), file: UploadFile = File(...),
                       current_user: models.User = Depends(get_current_user)):
    expression = _model.id == id
    bookServices.change_image(db=db, image=file, expression=expression)


@router.delete('/{id}/delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(id: int, db: Session = Depends(get_db),
                            current_user: models.User = Depends(get_current_user)):
    bookServices.delete_book(db=db, id=id)


