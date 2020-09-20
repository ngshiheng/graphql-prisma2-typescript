import { PrismaClient } from '@prisma/client/index';
import { ApolloServer } from 'apollo-server';
import { Request } from 'express';
import { resolve } from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { SERVER_PORT } from './utils/constants';

export interface Context {
    prisma: PrismaClient;
    req: Request;
}

const main = async () => {
    const schema = await buildSchema({
        resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
        emitSchemaFile: resolve(__dirname, 'schema/schema.graphql'),
        validate: false,
    });

    const prisma = new PrismaClient();
    const server = new ApolloServer({
        schema,
        playground: true,
        context: ({ req }) => ({ req, prisma } as Context),
    });
    await server.listen(SERVER_PORT);
    console.log(`🚀 Server is running on http://localhost:${SERVER_PORT}`);
};

main().catch(console.error);
