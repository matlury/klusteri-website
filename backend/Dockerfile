FROM python:3.10.13-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /backend

RUN pip install poetry

RUN poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock /backend/

RUN poetry install

COPY . .

ENTRYPOINT ["poetry", "run", "python", "manage.py", "runserver"]

