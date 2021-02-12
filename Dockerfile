FROM mhart/alpine-node:latest

RUN mkdir app

WORKDIR app/

COPY . .

RUN npm install

EXPOSE 3978

CMD node ./index.js