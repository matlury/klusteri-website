# Multi-stage build for production
FROM python:3.10.13-slim-bullseye as builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Set environment variables
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Copy poetry files
WORKDIR /app
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install --without dev --no-root && rm -rf $POETRY_CACHE_DIR

# Production stage
FROM python:3.10.13-slim-bullseye as production

# Install runtime system dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r django && useradd -r -g django django

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=backend.settings \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder --chown=django:django /app/.venv /app/.venv

# Copy application code
COPY --chown=django:django . .

# Create necessary directories with proper permissions
RUN mkdir -p /app/staticfiles /app/media && \
    chown -R django:django /app && \
    chmod -R 775 /app/staticfiles /app/media

# Switch to non-root user
USER django

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/api/users/userinfo', timeout=10)" || exit 1

# Run migrations and start uvicorn (ASGI server)
CMD ["sh", "-c", "mkdir -p /app/staticfiles && chmod 755 /app/staticfiles && python manage.py collectstatic --noinput && python manage.py migrate && uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --workers 4 --loop uvloop --http httptools"]