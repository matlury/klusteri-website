FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=true

WORKDIR /app

# Install Poetry
RUN pip install poetry

# Configure Poetry
RUN poetry config virtualenvs.create false

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install --without dev --no-root

# Copy application code
COPY . .

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

# OpenShift Permission Fix:
# 1. Ensure the directory is owned by the root group
# 2. Grant group-write permissions so the dynamic user can write (logs/tmp)
RUN chgrp -R 0 /app && \
    chmod -R g=u /app

# OpenShift uses high ports; 8000 is standard
EXPOSE 8000

# Run as a non-root user (important for local testing/best practice)
USER 1001

# Use entrypoint script to run migrations and start gunicorn
ENTRYPOINT ["/app/entrypoint.sh"]