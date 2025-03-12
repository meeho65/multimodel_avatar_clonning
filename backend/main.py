from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import backend.models as models
from backend.database import engine, get_db
from backend.auth import signup, login
from backend.schemas import UserCreate, Token
from fastapi.staticfiles import StaticFiles  # ✅ Import StaticFiles

# Initialize FastAPI app
app = FastAPI()

# Serve frontend files from the "frontend" directory
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Signup Route
@app.post("/signup")
def signup_route(user: UserCreate, db: Session = Depends(get_db)):
    return signup(user, db)

# Login Route
@app.post("/login", response_model=Token)
def login_route(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login(form_data, db)
