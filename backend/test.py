import replicate
output = replicate.run(
    "nvidia/sana-sprint-1.6b:6ed1ce77cdc8db65550e76d5ab82556d0cb31ac8ab3c4947b168a0bda7b962e4",
    input={
        "seed": -1,
        "width": 1024,
        "height": 1024,
        "prompt": "a tiny astronaut hatching from an egg on the moon",
        "output_format": "jpg",
        "guidance_scale": 4.5,
        "output_quality": 80,
        "inference_steps": 2,
        "intermediate_timesteps": 1.3
    }
)
print(output)
