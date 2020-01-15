
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

WORKDIR /app
COPY ./lunch-buddies-gui/build /app
COPY ./server/main.py /app
COPY ./server/requirements.txt /app
RUN pip install -r requirements.txt


CMD ["uvicorn", "main:app"]
