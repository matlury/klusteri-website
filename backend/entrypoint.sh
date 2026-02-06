#!/bin/bash
set -e

echo "=== Starting Django Application ==="
echo "Running Django migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "Django setup complete!"
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 \
    --workers 1 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    backend.wsgi:application