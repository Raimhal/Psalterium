from varname import nameof

from Exceptions import CustomNotFoundException, CustomExistException
from models import models
from schemas import schemas
from config.db import Session


def get_role_by_name(db: Session, name: str) -> models.Role:
    role =  get_role(db=db, name=name)
    if not role:
        CustomNotFoundException(entity=models.Role, key=nameof(name), value=name)
    return role


def get_role(db: Session, name: str) -> models.Role:
    return db.query(models.Role).filter_by(name = name).first()


def create_role(db: Session, model: schemas.RoleCreate) -> int:
    _ = get_role(db=db, name=model.name)
    if _:
        CustomExistException(entity=models.Role, key=nameof(model.name), value=model.name)

    role = models.Role(name=model.name)
    db.add(role)
    db.commit()
    print(role)
    return role.id


def update_role(db: Session, role: models.Role , model: schemas.RoleCreate):
    _ = get_role(db=db, name=model.name)
    if _:
        CustomExistException(entity=models.Role, key=nameof(model.name), value=model.name)

    role.name = model.name
    db.commit()



