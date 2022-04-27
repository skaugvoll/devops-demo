FROM node:17

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y yarn

RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN yarn # install dependencies

COPY . .

CMD yarn start
