from sqlalchemy import Column, Integer, String
from database import Base


# Define the User model
class User(Base):
    __tablename__ = "user"
    
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
