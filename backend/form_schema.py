from pydantic import BaseModel
from fastapi import UploadFile
from typing import Literal

# ------------- Pydantic Models -------------
class videogenForm(BaseModel):
    text: str
    avatar_name: str
    audio: UploadFile

class AvatargenForm(BaseModel):
    gender: Literal['male', 'female']
    facial_details: Literal['beard','no beard']
    Background: Literal['plain', 'outdoor', 'room', 'fantasy']
    art_style: Literal['realistic', 'anime', 'cartoon', 'cyberpunk', 'studio ghibli']
    accessories: Literal['none', 'glasses', 'hat', 'earrings', 'headphones', 'necklace']
    dressing: Literal['casual', 'formal', 'streetwear', 'traditional', 'sportswear']
    expression_description: Literal['relaxed face','smiling naturally','confident look', 'surprised expression']

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    fine_tuned: bool
    model_version_id: str
    photos: list[UploadFile]