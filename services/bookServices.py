import datetime
from typing import List

from models import models
from schemas import schemas
from config.db import Session
from datetime import datetime
from . import generalServices

_model = models.Book

def create_book(db: Session, model: schemas.BookCreate, current_user: models.User) -> int:
    book = _model(
        title=model.title,
        author=model.author,
        content=model.content,
        price=model.price,
        owner=current_user,
        count=model.count,
    )

    db.add(book)
    db.commit()
    return book.id


def update_book(db: Session, book: _model, model: schemas.BookCreate):
    book.title = model.title
    book.author = model.author
    book.content = model.content
    book.price = model.price
    book.date_published = datetime.utcnow()
    db.commit()


def set_genres(db: Session, book: models.Book, genres: List[schemas.GenreBase]):
    model = models.Genre
    book.genres = [generalServices.get_by_expression(db=db, model=model, expression=model.name == genre.name) for genre in genres]
    db.commit()

