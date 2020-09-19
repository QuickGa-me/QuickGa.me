FROM mhart/alpine-node
WORKDIR /app
COPY ./build/gameServer/package.json ./gameServer/package.json
WORKDIR /app/gameServer
RUN yarn install --prod
COPY ./build/gameServer/dist/index.js ./index.js
EXPOSE 80
CMD [ "yarn","start-local"  ]
