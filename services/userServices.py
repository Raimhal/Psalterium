from varname import nameof

from Exceptions import CustomExistException, CustomNotFoundException
from models import models
from schemas import schemas
from config.db import Session
from . import generalServices, roleServices, securityServices

def get_user_by_email(db: Session, email: str) -> models.User:
    user = check_email_in_use(db=db, email=email)
    if not user:
        CustomNotFoundException(entity=models.User, key=nameof(email), value=email)
    return user

def check_email_in_use(db: Session, email: str) -> models.User:
    return db.query(models.User).filter_by(email = email).first()

def create_user(db: Session, model: schemas.UserCreate) -> int:
    _ = check_email_in_use(db=db, email=model.email)
    if _:
        CustomExistException(entity=models.User, key=nameof(model.email), value=model.email)

    user_role = roleServices.get_role_by_name(db=db, name='User')
    user = models.User(
        email=model.email,
        username=model.username,
        first_name=model.first_name,
        last_name=model.last_name,
        hashed_password=securityServices.get_password_hash(model.password),
        role = user_role
    )

    db.add(user)
    db.commit()
    return user.id


def update_user(db: Session, user: models.User ,model: schemas.UserCreate):
    _ = check_email_in_use(db=db, email=model.email)
    if _:
        CustomExistException(entity=models.User, key=nameof(model.email), value=model.email)

    user.email = model.email
    user.username = model.username
    user.first_name = model.first_name
    user.last_name = model.last_name
    user.hashed_password = securityServices.get_password_hash(model.password)
    db.commit()

def change_user_role(db: Session, user_id: int, role_name: str):
    user = generalServices.get_by_id(db=db, model=models.User, id=user_id)
    role = roleServices.get_role_by_name(db=db, name=role_name)
    user.role = role
    db.commit()
