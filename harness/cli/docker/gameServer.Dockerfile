FROM mhart/alpine-node
WORKDIR /app
COPY ./gameServer/package.json ./gameServer/package.json
WORKDIR /app/gameServer
RUN yarn install --prod
COPY ./gameServer/dist/index.js ./index.js
EXPOSE 80
CMD [ "yarn","start-local"  ]
