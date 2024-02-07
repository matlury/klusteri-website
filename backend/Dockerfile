FROM python:3.10.13-bullseye
WORKDIR /backend
COPY . .

RUN poetry install

EXPOSE 5000
CMD ["python", "manage.py", "runserver"]
