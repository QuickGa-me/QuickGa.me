FROM mhart/alpine-node
WORKDIR /app
COPY ./build/gameServer/ ./gameServer
WORKDIR /app/gameServer
RUN yarn install --prod
EXPOSE 80
CMD [ "yarn","start-local"  ]
