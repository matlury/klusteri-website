# Production-ready Django application
FROM python:3.10.13-bullseye

# Set environment variables
ENV POETRY_VIRTUALENVS_IN_PROJECT=true \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=backend.settings

WORKDIR /backend

# Copy dependency files first for better caching
COPY pyproject.toml poetry.lock ./

# Install Poetry and dependencies
RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --without dev --no-root

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 django && \
    chown -R django:django /backend
USER django

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/api/users/userinfo', timeout=5)" || exit 1

CMD ["sh", "-c", "python manage.py migrate && gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 120"]