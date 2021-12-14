from datetime import datetime

from config.db import Session
from schemas import schemas
from services import generalServices
from models import models
_model = models.Order
_model_book = models.OrderBook


def create_order(db: Session, model: schemas.OrderCreate, current_user: models.User) -> int:
    order = _model(
        deliver_date=model.deliver_date,
        user_id=current_user.id
    )
    db.add(order)
    for order_book in model.books:
        generalServices.check_in_warehouse(db=db, model=models.Book,  id=order_book.book_id, count=order_book.count)
        book = generalServices.get_by_expression(db=db, model=models.Book, expression=models.Book.id == order_book.book_id)
        _book = _model_book(
            order=order,
            book_id=book.id,
            count=order_book.count
        )
        db.add(_book)
        order.books.append(_book)
        book.count -= _book.count
        db.commit()
    db.commit()
    return order.id


def delete_order(db: Session, id: int):
    order = generalServices.get_by_expression(db=db, model=_model, expression=_model.id == id)
    order_books = db.query(_model_book).filter(_model_book.order == order).all()
    for order_book in order_books:
        book = generalServices.get_by_expression(db=db, model=models.Book, expression=models.Book.id == order_book.book_id)
        book.count += order_book.count
        db.delete(order_book)
        db.commit()
    generalServices.delete(db=db, model=_model, id=id)
    db.commit()