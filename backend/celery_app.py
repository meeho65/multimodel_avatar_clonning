import replicate
import time
from celery import Celery
from sqlalchemy.orm import Session
from database import get_db, User

celery = Celery('worker', broker="redis://localhost:6379/0")

@celery.task
def fine_tuning(username: str):
    try:
        db = next(get_db())

        model = replicate.models.create(
            owner="meeho65",
            name=f"{username}",
            visibility="private",
            hardware="gpu-t4",
            description=f"A fine-tuned FLUX.1 model for {username}"
        )

        with open(f"{username}.zip", "rb") as f:
            training = replicate.trainings.create(
                version="ostris/flux-dev-lora-trainer:4ffd32160efd92e956d39c5338a9b8fbafca58e03f791f6d8011f3e20e8ea6fa",
                input={
                    "input_images": f,
                    "steps": 1000,
                    "trigger_word": "avatar_fyp_user"
                },
                destination=f"{model.owner}/{model.name}"
            )

        print(f"Training started: {training.status}")
        print(f"Training URL: https://replicate.com/p/{training.id}")

        while training.status not in ["succeeded", "failed", "canceled"]:
            time.sleep(30)
            training.reload()

        if training.status == "succeeded":
            user = db.query(User).filter(User.username == username).first()
            if user:
                user.fine_tuned = True
                user.model_version_id = replicate.models.get(f"meeho65/{username}").latest_version.id
                db.commit()
                print(f"User {username} fine-tuned successfully.")
        else:
            print(f"Training for {username} failed.")

    except Exception as e:
        print(f"[Fine-tuning Error for {username}] {e}")