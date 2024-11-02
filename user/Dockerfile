FROM node:18

WORKDIR /usr/src/auth-service

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3002

CMD ["yarn", "start"]