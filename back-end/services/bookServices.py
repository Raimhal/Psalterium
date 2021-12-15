import datetime
from typing import List, Any

from fastapi import UploadFile

from models import models
from schemas import schemas
from config.db import Session
from datetime import datetime
from . import generalServices, fileService


_model = models.Book

def create_book(db: Session, model: schemas.BookCreate, current_user: models.User) -> int:
    book = _model(
        title=model.title,
        author=model.author,
        content=model.content,
        price=model.price,
        owner=current_user,
        count=model.count,
        publication_date=model.publication_date
    )
    db.add(book)
    db.commit()
    return book.id


def update_book(db: Session, model: schemas.BookCreate, expression: Any):

    book = generalServices.get_by_expression(db=db, model=model, expression=expression)

    book.title = model.title
    book.author = model.author
    book.content = model.content
    book.price = model.price
    book.count = model.count
    book.update_date = datetime.utcnow()

    db.commit()


def set_genres(db: Session, genres: List[schemas.GenreBase], expression: Any):
    book = generalServices.get_by_expression(db=db, model=_model, expression=expression)
    book.genres = [
        generalServices.get_by_expression(
            db=db,
            model=(model:=models.Genre),
            expression=model.name == genre.name
        )
        for genre in genres
    ]
    db.commit()


def get_image(db: Session, id: int):
    book = generalServices.get_by_expression(db=db, model=_model, expression=_model.id == id)
    print(book.image)
    return fileService.get_file(book.image)


def change_image(db: Session, image: UploadFile, expression: Any):
    book = generalServices.get_by_expression(db=db, model=_model, expression=expression)
    if image:
        print(book.image)
        book.image = fileService.save_file(image)
        db.commit()


def delete_book(db: Session, id: int):
    book = generalServices.get_by_expression(db=db, model=_model, expression= _model.id == id)
    expression = models.OrderBook.book_id == book.id
    orders = generalServices.get_all_without_limit(db=db, model=models.OrderBook, expression=expression)
    for order in orders:
        expression = models.Order.id == order.order_id
        _order = generalServices.get_by_expression(db=db, model=models.Order, expression=expression)
        db.delete(order)
        if len(_order.books) == 1:
            db.delete(_order)
    db.delete(book)
    db.commit()

