#!/bin/bash
set -e

# Run Django migrations
echo "Running Django migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 backend.wsgi:application