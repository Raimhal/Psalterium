from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


# books
class BookBase(BaseModel):
    title: str
    author: str
    content: str
    price: float
    count: int

class BookCreate(BookBase):
    pass

class BookDto(BookBase):
    id: int
    owner_id: int
    publication_date: datetime



    class Config:
        orm_mode = True


# users
class UserBase(BaseModel):
    email: str
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserDto(UserBase):
    id: int
    role_id: int = None

    class Config:
        orm_mode = True


class User(UserDto):
    books: List[BookDto] = []

    class Config:
        orm_mode = True


# roles
class RoleBase(BaseModel):
    name: str


class RoleCreate(RoleBase):
    pass

class RoleDto(RoleBase):
    id: int

    class Config:
        orm_mode = True

class Role(RoleDto):
    users: List[UserDto] = []

    class Config:
        orm_mode = True


# token
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# orders
class OrderBase(BaseModel):
    pass


class OrderCreate(OrderBase):
    pass


class OrderDto(OrderBase):
    id: int
    user_id: int
    deliver_date: datetime

    class Config:
        orm_mode = True


class Order(OrderDto):
    books: List[BookDto] = []

    class Config:
        orm_mode = True


# genres
class GenreBase(BaseModel):
    name: str


class GenreCreate(GenreBase):
    pass


class GenreDto(GenreBase):
    id: int

    class Config:
        orm_mode = True


class Genre(GenreDto):
    books: List[BookDto] = []

    class Config:
        orm_mode = True


class Book(BookDto):
    books: List[OrderDto] = []
    genres: List[GenreDto] = []

    class Config:
        orm_mode = True











