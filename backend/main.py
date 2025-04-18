import replicate
from pydantic import BaseModel
from fastapi import FastAPI,UploadFile,Form

class ttsForm(BaseModel):
	audio: UploadFile
	text: str

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

