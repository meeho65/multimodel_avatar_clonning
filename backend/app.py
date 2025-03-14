from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from backend.database import get_db, Base, engine
from backend.models import User
from backend.schemas import UserCreate, Token
from backend.auth import hash_password, verify_password, create_access_token, signup, login

app = FastAPI()
Base.metadata.create_all(bind=engine)

@app.post("/signup")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return signup(user, db)

@app.post("/login", response_model=Token)
def user_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login(form_data, db)