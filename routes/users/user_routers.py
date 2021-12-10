from typing import List

from fastapi import APIRouter, Depends
from starlette import status
from models import models
from schemas import schemas
from services import generalServices, userServices
from config.dependencies import get_db


router = APIRouter(prefix='/users',tags=['users'])


@router.get('', response_model=List[schemas.User])
async def get_users(skip: int=0, limit: int=10, db: get_db = Depends()):
    return generalServices.get_all(db=db, model=models.User, skip=skip, limit=limit)


@router.get('/{id:int}', response_model=schemas.User)
async def get_user_by_id(id: int, db: get_db = Depends()):
    return generalServices.get_by_id(db=db, model=models.User, id=id)


@router.get('/email', response_model=schemas.User)
async def get_user_by_email(email: str, db: get_db = Depends()):
    return userServices.get_user_by_email(db=db, email=email)


@router.post('', response_model=int)
async def create_user(userCreate: schemas.UserCreate, db: get_db = Depends()):
    return userServices.create_user(db=db, model=userCreate)


@router.put('/{id:int}/update', status_code=status.HTTP_204_NO_CONTENT)
async def update_user_by_id(id: int, userUpdate: schemas.UserCreate, db: get_db = Depends()):
    user = generalServices.get_by_id(db=db, id=id, model=models.User)
    userServices.update_user(db=db, user=user, model=userUpdate)


@router.put('/email/update', status_code=status.HTTP_204_NO_CONTENT)
async def update_user_by_email(email: str, userUpdate: schemas.UserCreate, db: get_db = Depends()):
    user = userServices.get_user_by_email(db=db, email=email)
    userServices.update_user(db=db, user=user, model=userUpdate)

@router.delete('/{id}/delete', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_by_id(id: int, db: get_db = Depends()):
    generalServices.delete(db=db, model=models.User, id=id)
