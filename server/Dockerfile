FROM python:3.10-alpine AS builder
RUN apk add --no-cache build-base python3-dev libffi-dev openssl-dev cargo
WORKDIR /app

COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --upgrade pip && \
    pip3 install -r requirements.txt

COPY . /app

RUN if [ -d /pickles ]; then rm -rf /pickles; fi && mkdir /pickles

EXPOSE 5000
CMD ["python3", "app.py"]

