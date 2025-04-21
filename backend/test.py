import asyncio
import fal_client

async def subscribe():
    handler = await fal_client.submit_async(
        "fal-ai/sadtalker",
        arguments={
            "source_image_url": "https://storage.googleapis.com/falserverless/model_tests/sadtalker/anime_girl.png",
            "driven_audio_url": "https://storage.googleapis.com/falserverless/model_tests/sadtalker/deyu.wav"
        },
    )

    async for event in handler.iter_events(with_logs=True):
        if hasattr(event, 'position'):
            print(f"Queue position: {event.position}")
        elif hasattr(event, 'logs'):
            print(f"Log: {event.logs}")
        elif hasattr(event, 'progress'):
            print(f"Progress: {event.progress * 100:.1f}%")

    result = await handler.get()

    print(result)


if __name__ == "__main__":
    asyncio.run(subscribe())
