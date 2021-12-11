from datetime import datetime

from sqlalchemy import Float, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from config.db import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    username = Column(String, index=True)
    first_name = Column(String)
    last_name = Column(String)

    role_id = Column(Integer, ForeignKey('roles.id'))
    role = relationship('Role', back_populates='users')

    books = relationship('Book', back_populates='owner')

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    users = relationship('User', back_populates='role')

class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    content = Column(String)
    price = Column(Float)
    date_published = Column(DateTime, default=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship('User', back_populates='books')






