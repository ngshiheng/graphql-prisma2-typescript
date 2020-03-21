<h1 align="center"><strong>GraphQL Prisma TypeScript Server Boilerplate</strong></h1>

<br />

<div align="center"><img src="https://imgur.com/1MfnLVl.png" /></div>

<div align="center"><strong>Just another GraphQL server boilerplate (╯ಠ_ರೃ)╯︵ ┻━┻</strong></div>

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/ngshiheng/graphql-prisma2-typescript/blob/master/LICENSE)

A GraphQL, Prisma 2, TypeScript server boilerplate

# Tech Stacks

-   [prisma2](https://github.com/prisma/prisma2/)
-   [typescript](https://www.typescriptlang.org/)
-   [typegraphql-prisma](https://www.npmjs.com/package/typegraphql-prisma)

# Getting Started

## Installing dependencies

```bash
yarn install
```

## Setting up PostgreSQL

_Assuming you have a running PostgreSQL instance on port:5432 & `psql` installed:_

1. `createdb <database-name>`
2. `yarn prisma2 migrate save --name '<migration-message>' --experimental`
3. `yarn prisma2 migrate up --experimental`

# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change

## Steps

1. Fork this
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
