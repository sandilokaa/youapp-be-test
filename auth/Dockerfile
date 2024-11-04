FROM node:18.18.0

WORKDIR /usr/src/auth-service

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]