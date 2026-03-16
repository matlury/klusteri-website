#!/bin/bash
set -e

echo "=== Starting Django Application ==="
echo "Running Django migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "Django setup complete!"
echo "Starting Gunicorn with Uvicorn workers..."

# Using UvicornWorker to support ASGI
# Use gunicorn_config.py to control scheduler startup
exec gunicorn --config gunicorn_config.py backend.asgi:application
