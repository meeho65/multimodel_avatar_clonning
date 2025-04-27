Before running the fastapi app start the celery worker using the command:
`celery -A celery_app.celery worker --loglevel=info`

Than in another terminal start the fastapi app. Both the celery worker and fastapi app should be running at the same time.