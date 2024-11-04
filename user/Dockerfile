FROM node:18.18.0

WORKDIR /usr/src/user-service

COPY package*.json tsconfig.json ./

RUN yarn install

COPY ../auth /usr/src/user-service/auth

COPY . .

RUN yarn build

EXPOSE 3002

CMD ["yarn", "start"]