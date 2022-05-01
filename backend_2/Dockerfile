FROM node:17

# COPY . /server

LABEL maintainer="Sigve Skaugvoll"
LABEL mail="skaugvoll@gmail.com"

ARG PORT=3000
ARG HOST="0.0.0.0"

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y yarn
RUN mkdir /app
WORKDIR /app
COPY . .

ENV HOST=$HOST
ENV PORT=$PORT

EXPOSE $PORT
RUN yarn install

CMD yarn dev