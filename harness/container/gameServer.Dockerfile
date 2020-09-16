FROM mhart/alpine-node
WORKDIR /app
COPY ./build/api/ ./api
WORKDIR /app/api
RUN yarn install
EXPOSE 5503
CMD [ "yarn","start"  ]
