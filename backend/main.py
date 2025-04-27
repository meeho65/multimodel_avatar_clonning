import os
import io
import boto3
import zipfile
import requests
import replicate
import traceback
import fal_client
from fastapi import Query
from sqlalchemy.orm import Session
from celery_app import fine_tuning
from database import engine, Base, get_db
from fastapi.responses import JSONResponse
from auth import login, signup, get_current_user
from fastapi.middleware.cors import CORSMiddleware
from utilty import generate_flux_prompt,gen_name,tts
from fastapi.security import OAuth2PasswordRequestForm
from form_schema import UserCreate,videogenForm,AvatargenForm
from fastapi import FastAPI,Depends, HTTPException, status, Form

app = FastAPI()
Base.metadata.create_all(bind=engine)

s3 = boto3.client('s3')
BUCKET_NAME = os.environ['BUCKET_NAME']
# Optional: Add CORS if calling from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origin(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
@app.post('/avatar_gen')
async def avatar_gen(
        formData: AvatargenForm = Form(),
    	current_user=Depends(get_current_user)
):
    try:
        if not current_user.fine_tuned:
            return JSONResponse(content={"Error":"Your model hasn't been fine-tuned yet."})
        
        prompt = generate_flux_prompt(gender=formData.gender,
    			bg=formData.Background,
    			art_style=formData.art_style,
    			accessories=formData.accessories,
    			dressing=formData.dressing,
                expression_description=formData.expression_description,
                facial_details=formData.facial_details
                )
		
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
        response = requests.get(output[0].url)

        generated_name = gen_name()
        avatar_name = f"avatar_{generated_name}.webp"
        s3_path = f"Avatars/{current_user.username}/{generated_name}/{avatar_name}"

        # Upload to S3
        with io.BytesIO(response.content) as buffer:
            s3.upload_fileobj(
                buffer,
                BUCKET_NAME,
                s3_path
            )
        
        url = s3.generate_presigned_url(
            'get_object',
            {
                'Bucket':BUCKET_NAME,
                'Key':s3_path
            },
            ExpiresIn=180
        )

        return JSONResponse({f"{avatar_name}":url})
		
    except HTTPException as e:
        raise e  # Let FastAPI handle known auth errors
    except Exception as e:
        print("[TTS Error]", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Avatar generation failed")    
    

@app.post("/video_gen")
async def video_gen(
    formData: videogenForm = Form(),
    current_user=Depends(get_current_user)  # Ensures user is logged in
):
    try:
        if not current_user.fine_tuned:
            return JSONResponse(content={"Error":"Your model hasn't been fine-tuned yet."})

        user = current_user.username
        avatar = formData.avatar_name

        s3.download_file(
            Bucket=os.environ['BUCKET_NAME'],
            Key=f'Avatars/{user}/{avatar.replace("avatar_", "")}/{avatar}.webp',
            Filename=f'{avatar}.webp'
        )

        with open("src_audio.wav", 'wb') as file:
            audioData = await formData.audio.read()
            file.write(audioData)

        result_audio = tts('src_audio.wav', formData.text) 

        if not result_audio:
            return JSONResponse(content={"message": "Unable to clone Audio."})

        src_audio = fal_client.upload_file("output.wav")
        src_img = fal_client.upload_file(f"{avatar}.webp")

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
        
        response = requests.get(result['video']['url'])
        video_name = gen_name()

        print(result['video']['url'])

        with io.BytesIO(response.content) as buffer:
            s3.upload_fileobj(
                buffer,
                BUCKET_NAME,
                f'Avatars/{user}/{avatar.replace("avatar_", "")}/{video_name}.mp4'
            )

        url = s3.generate_presigned_url(
            'get_object',
            {
                'Bucket':BUCKET_NAME,
                'Key':f'Avatars/{user}/{avatar.replace("avatar_", "")}/{video_name}.mp4'
            },
            ExpiresIn=180
        )

        os.remove('output.wav')
        os.remove(f'{avatar}.webp')
        os.remove('src_audio.wav')
        return JSONResponse(content={"message": f"Video generated at {url}"})
    
    except HTTPException as e:
        raise e  # Let FastAPI handle known auth errors
    except Exception as e:
        print("[TTS Error]", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Video generation failed")
    
@app.get('/get_avatars')
async def get_avatars(current_user=Depends(get_current_user)):
    try:
        if not current_user.fine_tuned:
            return JSONResponse(content={"Error":"Your model hasn't been fine-tuned yet."})
        
        user = current_user.username
        response = s3.list_objects_v2(Bucket=BUCKET_NAME,Prefix=f'Avatars/{user}')
        if 'Contents' not in response:
            return JSONResponse({'error':f"You don't have any avatars"})
        
        avatars=[]
        for object in response['Contents']:
            avatars.append(object['Key'].split('/')[-1].split('.')[0])

        return JSONResponse({'data':avatars})
    
    except HTTPException as e:
        raise e  # Let FastAPI handle known auth errors
    except Exception as e:
        print("[TTS Error]", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Couldn't retrieve all avatars")

@app.get('/get_avatars_with_images')
async def get_avatars_with_images(current_user=Depends(get_current_user)):
    try:
        if not current_user.fine_tuned:
            return JSONResponse(content={"Error":"Your model hasn't been fine-tuned yet."})
        
        user = current_user.username
        response = s3.list_objects_v2(Bucket=BUCKET_NAME,Prefix=f'Avatars/{user}')
        if 'Contents' not in response:
            return JSONResponse({'error':f"You don't have any avatars"})
        
        avatar_paths=[]
        for object in response['Contents']:
            avatar_paths.append(object['Key'])
        
        data = {}
        for avatar_path in avatar_paths:
            key = avatar_path.split('/')[-1].split('.')[0]
            url = s3.generate_presigned_url(
                'get_object',
                {
                    'Bucket':BUCKET_NAME,
                    'Key':avatar_path
                },
                ExpiresIn=180
            )
            data[key] = url

        return JSONResponse(data)
    
    except HTTPException as e:
        raise e  # Let FastAPI handle known auth errors
    except Exception as e:
        print("[TTS Error]", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Couldn't retrieve all avatars")

@app.get('/get_videos')
async def get_videos(avatar_name = Query(),current_user=Depends(get_current_user)):
    try:
        if not current_user.fine_tuned:
            return JSONResponse(content={"Error":"Your model hasn't been fine-tuned yet."})
        
        user = current_user.username
        response = s3.list_objects_v2(Bucket=BUCKET_NAME,Prefix=f"Avatars/{user}/{avatar_name.replace('avatar_','')}")
        if 'Contents' not in response:
            return JSONResponse({'error':f"You don't have any avatars"})
        
        video_paths=[]
        for object in response['Contents']:
            video_paths.append(object['Key'])
        
        data = {}
        for video_path in video_paths:
            if video_path.endswith('.webp'):
                continue
            key = video_path.split('/')[-1].split('.')[0]
            url = s3.generate_presigned_url(
                'get_object',
                {
                    'Bucket':BUCKET_NAME,
                    'Key':video_path
                },
                ExpiresIn=180
            )
            data[key] = url

        return JSONResponse(data)
    
    except HTTPException as e:
        raise e  # Let FastAPI handle known auth errors
    except Exception as e:
        print("[TTS Error]", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Couldn't retrieve videos.")