FROM python:3.10.13-bullseye

ENV POETRY_VIRTUALENVS_IN_PROJECT=true

WORKDIR /backend

COPY . .

RUN chmod -R 777 *

RUN pip install poetry

RUN poetry config virtualenvs.create false

RUN poetry install --no-dev

WORKDIR /backend/backend

EXPOSE 8000

CMD ["/bin/bash", "-c", "python manage.py makemigrations;python manage.py migrate;python manage.py runserver 0.0.0.0:8000"]
