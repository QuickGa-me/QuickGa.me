FROM mhart/alpine-node
RUN yarn global add local-web-server
WORKDIR /app
COPY ./build/site ./site
WORKDIR /app/site
EXPOSE 44444
CMD [ "ws","--port=44444","--spa","index.html"]
