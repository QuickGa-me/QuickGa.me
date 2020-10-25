FROM mhart/alpine-node
WORKDIR /app
COPY ./api/package.json ./api/package.json
WORKDIR /app/api
RUN yarn install
COPY ./api ./
EXPOSE 5503
CMD [ "yarn","start"  ]
