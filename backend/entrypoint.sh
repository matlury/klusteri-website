#!/bin/bash
set -e

echo "=== Starting Django Application ==="
echo "Running Django migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "Django setup complete!"

echo "Starting Gunicorn with gevent..."

exec gunicorn backend.wsgi:application \

    --bind 0.0.0.0:8000 \

    --workers 2 \

    --worker-class gevent \

    --worker-connections 500 \

    --max-requests 1000 \

    --max-requests-jitter 100 \

    --timeout 60 \

    --keep-alive 2 \

    --access-logfile - \

    --error-logfile -




