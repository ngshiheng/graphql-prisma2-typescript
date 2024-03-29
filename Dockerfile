FROM node:12-alpine

WORKDIR /graphql-prisma2-typescript

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . /graphql-prisma2-typescript/

EXPOSE 4001

CMD [ "yarn", "start"]
