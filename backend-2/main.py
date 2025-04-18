from fastapi.security import OAuth2PasswordRequestForm
#from sqlalchemy.orm import Session
#from database import get_db, Base, engine
#from schemas import UserCreate, Token
#from auth import signup, login
from fastapi import FastAPI, Depends, UploadFile, Form
from pydantic import BaseModel
import subprocess

app = FastAPI()
#Base.metadata.create_all(bind=engine)

class ttsForm(BaseModel):
    text: str
    audio: UploadFile

class videogenForm(BaseModel):
    audio: UploadFile
    img: UploadFile


# @app.post("/signup")
# def register_user(user: UserCreate, db: Session = Depends(get_db)):
#     return signup(user, db)

# @app.post("/login", response_model=Token)
# def user_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     return login(form_data, db)

@app.post("/text_to_speech")
async def text_to_speech(form_data: ttsForm = Form()):
    with open('test_tts/audio.wav','wb') as file:
        data = await form_data.audio.read()
        file.write(data)

    command = [
        "f5-tts_infer-cli",
        "--model", "F5TTS_v1_Base",
        "--ref_audio", "test_tts/audio.wav",
        "--ref_text", "A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs",
        "--gen_text", form_data.text
    ]

    subprocess.run(command, capture_output=False)
    return {"message":"Audio generated at test_tts/infer_cli_basic.wav"}    

@app.post("/video_gen")
async def video_gen(form_data:videogenForm = Form()):
    with open("test_video/audio.wav",'wb') as file:
        data = await form_data.audio.read()
        file.write(data)
    
    with open("test_video/img.jpg",'wb') as file:
        data = await form_data.img.read()
        file.write(data)

    command = [
        "python", "inference.py",
        "--driven_audio", "../test_video/audio.wav",
        "--source_image", "../test_video/img.jpg",
        "--result_dir", "results/",
        "--still","--cpu"
    ]

    subprocess.run(command,cwd="video_gen", capture_output=False)
    return {"message":"Video generated at test_vid"}





    
