FROM mhart/alpine-node
WORKDIR /app

COPY package-docker.json ./package.json

RUN yarn install --prod

FROM mhart/alpine-node:slim-12

COPY ./dist .
EXPOSE 80
CMD [ "node", "index.js" ]

