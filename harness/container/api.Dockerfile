FROM mhart/alpine-node
WORKDIR /app
COPY ./build/api/package.json ./api/package.json
WORKDIR /app/api
RUN yarn install
COPY ./build/api/ ./
EXPOSE 5503
CMD [ "yarn","start"  ]
