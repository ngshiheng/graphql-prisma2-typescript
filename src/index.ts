import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { resolve } from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

const main = async () => {
    const schema = await buildSchema({
        resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
        emitSchemaFile: resolve(__dirname, 'schema/generated-schema.graphql'),
        validate: false,
    });

    const prisma = new PrismaClient();
    const server = new ApolloServer({
        schema,
        playground: true,
        context: ({ req }) => ({ ...req, prisma }),
    });
    await server.listen(process.env.PORT);
    console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
};

main().catch(console.error);
