import replicate
from pydantic import BaseModel
from fastapi import FastAPI,UploadFile,Form
from fastapi.responses import JSONResponse

class ttsForm(BaseModel):
	audio: UploadFile
	text: str

class videogenForm(BaseModel):
	img: UploadFile
	audio: UploadFile

app=FastAPI()

@app.post("/tts")
async def tts(formData:ttsForm = Form()):
	text = formData.text

	with open("src_audio.wav",'wb') as file:
		audioData = await formData.audio.read()
		file.write(audioData)

	speaker = open("src_audio.wav", "rb");
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


	return JSONResponse(content={"message": "Audio generated at output.wav"})

@app.post("/video_gen")
async def video_gen(formData:videogenForm = Form()):
	with open("src_audio.wav",'wb') as file:
                audioData = await formData.audio.read()
                file.write(audioData)

	with open("src_img.jpg",'wb') as file:
                imgData = await formData.img.read()
                file.write(imgData)

	driven_audio = open("src_audio.wav",'rb');
	src_img = open("src_img.jpg",'rb');

	input={
        	"facerender": "facevid2vid",
        	"pose_style": 0,
        	"preprocess": "crop",
        	"still_mode": True,
        	"driven_audio": driven_audio,
        	"source_image": src_img,
        	"use_enhancer": True,
        	"size_of_image": 256,
        	"expression_scale": 1
    		}

	output = replicate.run(
    		"cjwbw/sadtalker:a519cc0cfebaaeade068b23899165a11ec76aaa1d2b313d40d214f204ec957a3",
		input=input
	)


	with open("output.mp4", "wb") as file:
                file.write(output.read())


	return JSONResponse(content={"message": "Video generated at output.mp4"})

