from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


# books
class BookBase(BaseModel):
    title: str
    author: str
    content: str
    price: str


class BookCreate(BookBase):
    pass


class Book(BookBase):
    id: int
    owner_id: int
    date_published: datetime

    class Config:
        orm_mode = True


# users
class UserBase(BaseModel):
    email: str
    username: str
    firstName: str
    lastName: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    role_id: int = None
    books: List[Book] = []

    class Config:
        orm_mode = True


# roles
class RoleBase(BaseModel):
    name: str


class RoleCreate(RoleBase):
    pass


class Role(RoleBase):
    id: int
    users: List[User] = []

    class Config:
        orm_mode = True











