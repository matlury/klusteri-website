FROM python:3.10.13-bullseye

RUN pip install poetry

COPY . .

RUN poetry config virtualenvs.create false

RUN poetry install

ENTRYPOINT ["poetry", "run", "python", "manage.py", "runserver"]

