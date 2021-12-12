from varname import nameof

from Exceptions import CustomExistException
from models import models
from schemas import schemas
from config.db import Session

_model = models.Role

def get_role(db: Session, name: str) -> _model:
    return db.query(_model).filter_by(name = name).first()


def create_role(db: Session, model: schemas.RoleCreate) -> int:
    _ = get_role(db=db, name=model.name)
    if _:
        CustomExistException(entity=_model, key=nameof(model.name), value=model.name)

    role = _model(name=model.name)
    db.add(role)
    db.commit()
    print(role)
    return role.id


def update_role(db: Session, role: _model , model: schemas.RoleCreate):
    _ = get_role(db=db, name=model.name)
    if _:
        CustomExistException(entity=_model, key=nameof(model.name), value=model.name)

    role.name = model.name
    db.commit()



