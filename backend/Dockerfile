FROM python:3.10.13-bullseye

ENV POETRY_VIRTUALENVS_IN_PROJECT=true

WORKDIR /backend

COPY . .

RUN chmod -R 777 *

RUN pip install poetry

COPY poetry.lock pyproject.toml /backend/

RUN poetry install

EXPOSE 8000

ENTRYPOINT ["poetry", "run", "python", "manage.py", "runserver"]
