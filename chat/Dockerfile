FROM node:18.18.0

WORKDIR /usr/src/chat-service

COPY package*.json tsconfig.json ./

RUN yarn install

COPY ../auth /usr/src/chat-service/auth
COPY ../user /usr/src/chat-service/user

COPY . .

RUN yarn build

EXPOSE 3004

CMD ["yarn", "start"]