import os
import boto3
import replicate
import traceback
import fal_client
from pydantic import BaseModel
from sqlalchemy.orm import Session
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


# ------------- Pydantic Models -------------

class videogenForm(BaseModel):
	text: str 
	avatar_name: str
	audio: UploadFile

class UserCreate(BaseModel):
	username: str
	email: str
	password: str
	fine_tuned: bool


# ------------- Auth Endpoints -------------
@app.post("/signup")
def register_user(user: UserCreate = Form(), db: Session = Depends(get_db)):
    try:
        return signup(user, db)
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


@app.post("/video_gen")
async def video_gen(
    formData: videogenForm = Form(), 
    current_user=Depends(get_current_user)  # Ensures user is logged in
):
	try:		
		user = current_user.username
		avatar = formData.avatar_name

		#print(user,avatar)

		s3.download_file(os.environ['BUCKET_NAME'], 'Users'+'/'+user+'/'+avatar+'.jpg', f'{avatar}.jpg')

		with open("src_audio.wav", 'wb') as file:
			audioData = await formData.audio.read()
			file.write(audioData)
		
		result_audio = tts('src_audio.wav', formData.text) 

		if not result_audio:
			return JSONResponse(content={"message":"Unable to clone Audio."})
              
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