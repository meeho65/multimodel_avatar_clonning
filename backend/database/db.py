import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv


load_dotenv()

USERNAME = os.environ['DB_USERNAME']
PASSWORD = os.environ['DB_PASSWORD']
DB_NAME = "db_avatar_fyp"
HOST = 'db-avatar-fyp.cz04i22gicie.eu-north-1.rds.amazonaws.com'
PORT = "3306"

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"charset": "utf8mb4"})

local_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = local_session()
    try:
        yield db
    finally:
        db.close()


