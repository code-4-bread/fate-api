FROM node:12.16.3-alpine

RUN mkdir src

WORKDIR /src

COPY ./package.json /src

RUN npm install

COPY . /src

RUN npm run build

CMD node build/server.js