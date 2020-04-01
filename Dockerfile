FROM node:alpine

WORKDIR /app

COPY ./package.json /app/ame-creator/
WORKDIR /app/ame-creator
RUN npm install --registry=https://registry.npm.taobao.org

ADD ./ /app/ame-creator/

CMD [ "npm", "run", "dev" ]

EXPOSE 8080
