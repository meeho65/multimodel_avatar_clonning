from fastapi.security import OAuth2PasswordBearer ,OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
import jwt

from fastapi import FastAPI, Depends, HTTPException, status
import backend.models as models
from database import engine ,sessionlocal
from sqlalchemy.orm import Session
from typing import Annotated

ACCESS_TOKEN_EXPIRE_MINUTES = 30
ALGORITHM = "HS256"
SECRET_KEY = "91577a3087e091f4d58e2a2c483f8b78b5e028de82fe6c4318a126d60978199d"

app =FastAPI()
models.Basemetadata.create_all(bind=engine)

def get_db():
    db =sessionlocal()
    try:
        yield db
    finally:
        db.close()
    
db_dependency = Annotated[Session, Depends(get_db)]
