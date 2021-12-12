import datetime

from sqlalchemy import Float, Column, ForeignKey, Integer, String, DateTime, Table
from sqlalchemy.orm import relationship

from config.db import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    username = Column(String, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)

    role_id = Column(Integer, ForeignKey('roles.id'))
    role = relationship('Role', back_populates='users')

    books = relationship('Book', back_populates='owner')

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    users = relationship('User', back_populates='role')

orders_books_temporary_table = \
    Table('orders_books', Base.metadata,
          Column('order_id', ForeignKey('orders.id'), primary_key=True),
          Column('book_id', ForeignKey('books.id'), primary_key=True)
          )

books_genres_temporary_table = \
    Table('books_genres', Base.metadata,
          Column('book_id', ForeignKey('books.id'), primary_key=True),
          Column('genre_id', ForeignKey('genres.id'), primary_key=True)
          )

class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    content = Column(String)
    price = Column(Float, nullable=False)
    publication_date = Column(DateTime, default=datetime.datetime.utcnow)
    count = Column(Integer)

    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship('User', back_populates='books')
    orders = relationship('Order', secondary=orders_books_temporary_table, back_populates='books', lazy=True)
    genres = relationship('Genre', secondary=books_genres_temporary_table, back_populates='books', lazy=True)


class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, index=True)
    deliver_date = Column(DateTime)
    user_id = Column(Integer, ForeignKey('users.id'))
    books = relationship('Book', secondary=orders_books_temporary_table, back_populates='orders', lazy=True)

class Genre(Base):
    __tablename__ = 'genres'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    books = relationship('Book', secondary=books_genres_temporary_table, back_populates='genres', lazy=True)


