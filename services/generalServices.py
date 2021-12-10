from typing import List, Any
from Exceptions import CustomNotFoundException
from varname import nameof

from config.db import Session

def get_all(db: Session, model: Any, skip: int, limit: int) -> List[Any]:
    return db.query(model).offset(skip).limit(limit).all()

def get_by_id(db: Session, model: Any, id: int) -> Any:
    entity = db.query(model).filter_by(id=id).first()
    if not entity:
        CustomNotFoundException(entity=model, key=nameof(id), value=id)
    return entity

def delete(db: Session, model: Any, id: int):
    entity = get_by_id(db=db, model=model, id=id)
    db.delete(entity)
    db.commit()

