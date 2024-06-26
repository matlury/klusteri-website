# Use the official Python image as a base
FROM python:3.10.13-bullseye

# Set environment variables
ENV POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /backend

# Copy the project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-dev --no-interaction --no-ansi

# Expose the application port
EXPOSE 8000

# Command to run the Django server
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]