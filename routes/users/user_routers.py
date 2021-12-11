
from typing import List

from fastapi import APIRouter, Depends
from starlette import status

from config.db import Session
from models import models
from schemas import schemas
from services import generalServices, userServices
from config.dependencies import get_db, get_current_user


router = APIRouter(prefix='/users',tags=['users'])


@router.get('', response_model=List[schemas.User])
async def get_users(skip: int=0, limit: int=10, db: Session = Depends(get_db)):
    return generalServices.get_all(db=db, model=models.User, skip=skip, limit=limit)


@router.get('/{id:int}', response_model=schemas.User)
async def get_user_by_id(id: int, db: Session = Depends(get_db)):
    return generalServices.get_by_id(db=db, model=models.User, id=id)


@router.get('/email', response_model=schemas.User)
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    return userServices.get_user_by_email(db=db, email=email)

@router.get("/me", response_model=schemas.User)
async def get_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.post('', response_model=int)
async def create_user(userCreate: schemas.UserCreate, db: Session = Depends(get_db)):
    return userServices.create_user(db=db, model=userCreate)


@router.put('/{id:int}/update', status_code=status.HTTP_204_NO_CONTENT)
async def update_user_by_id(id: int, userUpdate: schemas.UserCreate, db: Session = Depends(get_db)):
    user = generalServices.get_by_id(db=db, id=id, model=models.User)
    userServices.update_user(db=db, user=user, model=userUpdate)


@router.put('/email/update', status_code=status.HTTP_204_NO_CONTENT)
async def update_user_by_email(email: str, userUpdate: schemas.UserCreate, db: Session = Depends(get_db)):
    user = userServices.get_user_by_email(db=db, email=email)
    userServices.update_user(db=db, user=user, model=userUpdate)

@router.patch('/{id}/change_role', status_code=status.HTTP_204_NO_CONTENT)
async def update_user_role(id: int, role_name: str, db: Session = Depends(get_db)):
    userServices.change_user_role(db=db, user_id=id, role_name=role_name)

@router.delete('/{id}/delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_by_id(id: int, db: Session = Depends(get_db)):
    generalServices.delete(db=db, model=models.User, id=id)

