<h1 align="center"><strong>GraphQL Prisma TypeScript Server Boilerplate</strong></h1>

<br />

<div align="center"><img src="https://imgur.com/1MfnLVl.png" /></div>

<div align="center"><strong>Just another GraphQL server boilerplate (╯ಠ_ರೃ)╯︵ ┻━┻</strong></div>

<br />

[![CircleCI](https://circleci.com/gh/ngshiheng/graphql-prisma2-typescript/tree/master.svg?style=svg)](https://circleci.com/gh/ngshiheng/graphql-prisma2-typescript/tree/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/ngshiheng/graphql-prisma2-typescript/blob/master/LICENSE)

A GraphQL, Prisma 2, TypeScript server boilerplate

# Tech Stacks

-   [graphql](https://graphql.org/)
-   [prisma2](https://github.com/prisma/prisma2/)
-   [typescript](https://www.typescriptlang.org/)
-   [typegraphql](https://typegraphql.com/)

# Getting Started

## Installing dependencies

```bash
yarn install
```

## Setting up PostgreSQL

To run migration:

1. `yarn prisma migrate up --experimental`

On `schema.prisma` update, run:

1. `yarn prisma migrate save --name '<migration-message>' --experimental`
2. `yarn prisma migrate up --experimental`
3. `yarn prisma generate`

## Setup Environment Variables

1. Update `DATABASE_URL` accordingly inside `.env.example` and rename the file to `.env`
2. `export ACCESS_TOKEN_SECRET="your-own-secret"`
3. `export ACCESS_TOKEN_EXPIRY="1h"`
4. `export REFRESH_TOKEN_SECRET="another-secret"`
5. `export REFRESH_TOKEN_EXPIRY="1d"`

# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change

## Steps

1. Fork this
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

# Other Versions

-   https://github.com/ngshiheng/graphql-prisma-typescript
-   https://github.com/ngshiheng/graphql-prisma-nodejs

# Donating

<a href="https://www.buymeacoffee.com/jerryng" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-black.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;"></a>
