FROM node:18

WORKDIR /usr/src/chat-service

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3004

CMD ["yarn", "start"]