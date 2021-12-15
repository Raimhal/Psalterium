from typing import List, Any

from models import models
from Exceptions import CustomNotFoundException, CustomExistException, CustomCountException
from varname import nameof

from config.db import Session

def get_all(db: Session, model: Any, skip: int, limit: int) -> List[Any]:
    return db.query(model).offset(skip).limit(limit).all()

def get_all_without_limit(db: Session, model: Any, expression: Any) -> List[Any]:
    return db.query(model).filter(expression).all()

def get_by_expression(db: Session, model: Any, expression: Any) -> Any:
    entity = db.query(model).filter(expression).first()
    if not entity:
        key = expression.left.key
        value = expression.right.value
        CustomNotFoundException(entity=model, key=key, value=value)
    return entity

def delete(db: Session, model: Any, id: int):
    entity = get_by_expression(db=db, model=model, expression= model.id == id)
    db.delete(entity)
    db.commit()

def check_in_use_expression(db: Session, model: Any, entity: Any, expression: Any):
    _ = db.query(model).filter(expression).first()
    if _:
        CustomExistException(entity=model, key=nameof(entity.name), value=entity.name)

def check_in_warehouse(db: Session, model: Any,  id: int, count: int):
    expression = model.id == id
    entity = get_by_expression(db=db, model=model, expression=expression)
    if(entity.count < count):
        CustomCountException(entity=model, key=nameof(id), value=id)


