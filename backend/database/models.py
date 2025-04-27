from sqlalchemy import String,Column,Boolean
from .db import Base

class User(Base):
    __tablename__ = "User"
    
    username = Column(String(50), primary_key=True, unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    fine_tuned = Column(Boolean,nullable=False)
    model_version_id = Column(String(255), nullable=True)

