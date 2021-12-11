from typing import List

from fastapi import APIRouter, Depends
from starlette import status

from config.db import Session
from models import models
from schemas import schemas
from services import generalServices, roleServices
from config.dependencies import get_db

router = APIRouter(prefix='/roles', tags=['roles'])


@router.get('', response_model=List[schemas.Role])
async def get_roles(skip: int=0, limit: int=10, db: Session = Depends(get_db)):
    return generalServices.get_all(db=db, model=models.Role, skip=skip, limit=limit)


@router.get('/{id:int}', response_model=schemas.Role)
async def get_role_by_id(id: int, db: Session = Depends(get_db)):
    return generalServices.get_by_id(db=db, model=models.Role, id=id)


@router.get('/name', response_model=schemas.Role)
async def get_role_by_name(name: str, db: Session = Depends(get_db)):
    return roleServices.get_role_by_name(db=db, name=name)


@router.post('', response_model=int)
async def create_role(roleCreate: schemas.RoleCreate, db: Session = Depends(get_db)):
    return roleServices.create_role(db=db, model=roleCreate)


@router.put('/{id:int}/update', status_code=status.HTTP_204_NO_CONTENT)
async def update_role_by_id(id: int, roleUpdate: schemas.RoleCreate, db: Session = Depends(get_db)):
    role = generalServices.get_by_id(db=db, id=id, model=models.Role)
    roleServices.update_role(db=db, role=role, model=roleUpdate)

@router.delete('/{id:int}/delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_role_by_id(id: int, db: Session = Depends(get_db)):
    generalServices.delete(db=db, model=models.Role, id=id)

