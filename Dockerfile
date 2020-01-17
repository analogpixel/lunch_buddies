
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

COPY lunch-buddies-gui/build /app/static
COPY server/main.py /app
COPY server/requirements.txt /app
WORKDIR /app
RUN pip install -r requirements.txt


CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8000", "main:app"]
