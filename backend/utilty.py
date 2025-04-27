import replicate
import string
import random
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
    gender: str,
    bg: str,
    art_style: str,
    facial_details: str,
    accessories: str,
    dressing: str,
    expression_description
) -> str:
    if accessories !="none":
        accessories=" and "+accessories
    else:
        accessories=""
    
    background_map = {
        'plain': 'plain background',
        'gradient': 'gradient background',
        'outdoor': 'an outdoor scenery',
        'room': 'indoor room setting',
        'fantasy': 'fantasy background'
    }

    prompt = f"""A {art_style} style photo of avatar_fyp_user({gender}) with {facial_details}{accessories}, 
    {background_map[bg]} in natural lighting, wearing {dressing} clothes, sharp facial details similar to uploaded photos, 
    {expression_description}, looking directly at the camera."""

    return prompt    

def gen_name(length=12):
    """Generate random alphanumeric string of specified length"""
    chars = string.ascii_letters + string.digits  # a-z, A-Z, 0-9
    return ''.join(random.choices(chars, k=length))