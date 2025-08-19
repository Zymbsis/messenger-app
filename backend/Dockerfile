FROM python:3.13.7-slim-bookworm

WORKDIR /app

RUN pip install pipenv

COPY Pipfile Pipfile.lock ./
RUN pipenv install --system --deploy

COPY . .

CMD ["pipenv", "run", "fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
