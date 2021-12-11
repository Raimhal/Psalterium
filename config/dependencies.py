from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from starlette import status

from models import models
from schemas.schemas import TokenData
from . import SECRET_KEY, ALGORITHM
from .db import Session, Base, engine
from fastapi.security import OAuth2PasswordBearer
from services import generalServices, userServices

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

def create_database():
    return Base.metadata.create_all(bind=engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

def set_data_seed(db: Session = Depends(get_db)):
    generalServices.get_data_seed(db=db, model=models.User)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = userServices.get_user_by_email(db=db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
