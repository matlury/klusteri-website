FROM python:3.10.13-bullseye

RUN pip install poetry

COPY . .

RUN poetry install

ENTRYPOINT ["poetry", "run", "python", "backend/manage.py", "runserver"]

