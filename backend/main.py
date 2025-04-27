import os
import io
import boto3
import random
import string
import zipfile
import replicate
import traceback
import fal_client
from typing import Literal
from pydantic import BaseModel
from sqlalchemy.orm import Session
from celery_app import fine_tuning
from database import engine, Base, get_db
from fastapi.responses import JSONResponse
from auth import login, signup, get_current_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import FastAPI, UploadFile, Depends, HTTPException, status, Form


app = FastAPI()
Base.metadata.create_all(bind=engine)

s3 = boto3.client('s3')

# Optional: Add CORS if calling from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origin(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------- Utility Functions -----------
def tts(
    audio, text 
):
    try:
        speaker = open(audio, "rb")
        input = {
            "text": text,
            "speaker": speaker
        }

        output = replicate.run(
            "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
            input=input
        )

        with open("output.wav", "wb") as file:
            file.write(output.read())
        return True
    except:
        return False

def generate_flux_prompt(
    image_type: str,
    background: str,
    art_style: str,
    accessories: str,
    dressing: str
) -> str:
    # Map internal terms to more natural English
    image_type_map = {
        'portrait': 'portrait',
        'full_body': 'full body shot',
        'waist_up': 'waist-up view',
        'headshot': 'headshot'
    }
    background_map = {
        'plain': 'plain background',
        'gradient': 'gradient background',
        'outdoor': 'outdoor scenery',
        'room': 'indoor room setting',
        'fantasy': 'fantasy background'
    }
    art_style_map = {
        'realistic': 'realistic style',
        'anime': 'anime style',
        'cartoon': 'cartoon style',
        'pixel_art': 'pixel art style',
        'cyberpunk': 'cyberpunk theme',
        'sketch': 'hand-drawn sketch style'
    }
    accessories_map = {
        'none': '',
        'glasses': 'wearing glasses',
        'hat': 'wearing a hat',
        'earrings': 'wearing earrings',
        'headphones': 'wearing headphones',
        'necklace': 'wearing a necklace'
    }
    dressing_map = {
        'casual': 'casual clothes',
        'formal': 'formal attire',
        'streetwear': 'streetwear outfit',
        'fantasy_armor': 'fantasy armor',
        'traditional': 'traditional clothing',
        'sportswear': 'sportswear outfit'
    }

    prompt_parts = [
        "avatar_fyp_user",
        image_type_map.get(image_type, image_type),
        f"in {background_map.get(background, background)}",
        f"wearing {dressing_map.get(dressing, dressing)}",
        f"in {art_style_map.get(art_style, art_style)}",
        "looking directly at the camera",
    ]

    # Add accessories if not 'none'
    if accessories != 'none':
        prompt_parts.append(accessories_map.get(accessories, accessories))

    # Join all parts cleanly
    prompt = ", ".join([part for part in prompt_parts if part])

    return prompt

def name_gen(length=10):
    """Generate random alphanumeric string of specified length"""
    chars = string.ascii_letters + string.digits  # a-z, A-Z, 0-9
    return ''.join(random.choices(chars, k=length))

# ------------- Pydantic Models -------------

class videogenForm(BaseModel):
    text: str
    avatar_name: str
    audio: UploadFile

class AvatargenForm(BaseModel):
    image_type: Literal['portrait', 'waist_up', 'headshot']
    Background: Literal['plain', 'outdoor', 'room', 'fantasy']
    art_style: Literal['realistic', 'anime', 'cartoon', 'cyberpunk']
    accessories: Literal['none', 'glasses', 'hat', 'earrings', 'headphones', 'necklace']
    dressing: Literal['casual', 'formal', 'streetwear', 'traditional', 'sportswear']

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    fine_tuned: bool
    model_version_id: str
    photos: list[UploadFile]


# ------------- Auth Endpoints -------------
@app.post("/signup")
async def register_user(user: UserCreate = Form(), db: Session = Depends(get_db)):
    try:
        if len(user.photos) < 12:
            return JSONResponse(content={"error": "Upload atleast 12 photos."})

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for photo in user.photos:
                file_data = await photo.read()
                zip_file.writestr(photo.filename, file_data)
                await photo.seek(0)

        zip_buffer.seek(0)
        with open(f"{user.username}.zip", "wb") as f:
            f.write(zip_buffer.getvalue())

        info = signup(user, db)
        finetune_task = fine_tuning.delay(user.username)
        return info

    except Exception as e:
        print(f"[Signup Error] {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Something went wrong during signup"}
        )

@app.post("/login")
def user_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        return login(form_data, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[Login Error] {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Something went wrong during login"}
        )

# ------------- Protected Endpoints -------------

@app.get('/avatar_gen')
async def avatar_gen(
        formData: AvatargenForm = Form(),
    	current_user=Depends(get_current_user)
):
    try:
        if not current_user.fine_tuned:
            return JSONResponse(content={"Error":"Your model hasn't been fine-tuned yet."})
        
        prompt = generate_flux_prompt(formData.image_type,
    			formData.Background,
    			formData.art_style,
    			formData.accessories,
    			formData.dressing)
		
        print(prompt)
        return JSONResponse({"k":"L"})

        output = replicate.run(
    		f"meeho65/{current_user.username}:{current_user.model_version_id}",
        input={
        "model": "dev",
        "prompt": prompt,
        "go_fast": False,
        "lora_scale": 1,
        "megapixels": "1",
        "num_outputs": 1,
        "aspect_ratio": "1:1",
        "output_format": "webp",
        "guidance_scale": 3,
        "output_quality": 80,
        "prompt_strength": 0.8,
        "extra_lora_scale": 1,
        "num_inference_steps": 28
        }
		)
        print(output[0].url)
        return JSONResponse({"data":""})
		
    except HTTPException as e:
        raise e  # Let FastAPI handle known auth errors
    except Exception as e:
        print("[TTS Error]", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Avatar generation failed")    
    

@app.get("/video_gen")
async def video_gen(
    formData: videogenForm = Form(),
    current_user=Depends(get_current_user)  # Ensures user is logged in
):
    try:
        if not current_user.fine_tuned():
            return JSONResponse(content={"Error":"Your model hasn't been fine-tuned yet."})

        user = current_user.username
        avatar = formData.avatar_name

        #print(user,avatar)

        s3.download_file(os.environ['BUCKET_NAME'], 'Users'+'/'+user+'/'+avatar+'.jpg', f'{avatar}.jpg')

        with open("src_audio.wav", 'wb') as file:
            audioData = await formData.audio.read()
            file.write(audioData)

        result_audio = tts('src_audio.wav', formData.text) 

        if not result_audio:
            return JSONResponse(content={"message": "Unable to clone Audio."})

        src_audio = fal_client.upload_file("output.wav")
        src_img = fal_client.upload_file(f"{avatar}.jpg")

        handler = await fal_client.submit_async(
            "fal-ai/sadtalker",
            arguments={
                "source_image_url": src_img,
                "driven_audio_url": src_audio,
                "preprocess": "full",
                "still_mode": True
            },
        )

        async for event in handler.iter_events(with_logs=True):
            if hasattr(event, 'progress'):
                print(f"Progress: {event.progress * 100:.1f}%")

        result = await handler.get()
        
        return JSONResponse(content={"message": f"Video generated at {result['video']['url']}"})
    
    except HTTPException as e:
        raise e  # Let FastAPI handle known auth errors
    except Exception as e:
        print("[TTS Error]", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Video generation failed")
