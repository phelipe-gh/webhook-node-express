FROM node:16-alpine

WORKDIR /home/app

COPY package.json yarn.* tsconfig.json babel.config.js ./
COPY src/ ./src
COPY config/ ./config


RUN yarn install
RUN yarn build
RUN yarn install --production
CMD ["yarn", "start"]
