# Stage 1: Builder stage
FROM python:3.11-slim AS builder

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

# Install dependencies (without dev dependencies)
RUN poetry install --without dev --no-root

# Stage 2: Production stage
FROM python:3.11-slim

# Create non-root user for OpenShift compatibility
RUN useradd -m -r appuser && \
    mkdir /app && \
    chown -R appuser /app

# Copy Python packages from builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Set the working directory
WORKDIR /app

# Copy application code with proper ownership
COPY --chown=appuser:appuser . .

# Make entrypoint script executable (before switching user)
RUN chmod +x /app/entrypoint.sh

# OpenShift Permission Fix:
# Ensure the directory is owned by the root group for OpenShift random UIDs
RUN chgrp -R 0 /app && \
    chmod -R g=u /app

# Set environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8000

# Use entrypoint script to run migrations and start gunicorn
ENTRYPOINT ["/app/entrypoint.sh"]