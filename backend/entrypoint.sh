#!/bin/bash
set -e

echo "=== Starting Django Application ==="
echo "Running Django migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "Django setup complete!"
echo "Starting Gunicorn with Uvicorn workers..."

# Using UvicornWorker to support ASGI
exec gunicorn --bind 0.0.0.0:8000 \
    --workers 2 \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout 60 \
    --access-logfile - \
    --error-logfile - \
    backend.asgi:application
