import { Context } from '@src/index';
import { SALT_ROUNDS } from '@src/utils/constants';
import { ApolloServer } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import { hash } from 'bcryptjs';
import { Request } from 'express';
import gql from 'graphql-tag';
import { join } from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '../generated/prisma-client/index';

const prisma = new PrismaClient();
let request: Partial<Request>;
let postId: string;
const name: string = 'Post.test.ts';
const email: string = 'post-integration@test.com';
const password: string = 'test-password-123';

const constructTestServer = async (request?: Partial<Request>) => {
    const schema = await buildSchema({
        resolvers: [join(__dirname, '..', '/resolvers/**/*.{ts,js}')],
        validate: false,
    });
    const server = new ApolloServer({
        schema,
        playground: true,
        context: ({ req = request }) => ({ req, prisma } as Context),
    });
    return { server, prisma };
};

const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;

const CREATE_POST = gql`
    mutation createPost($title: String!, $category: PostCategory!) {
        createPost(title: $title, category: $category) {
            id
            title
            category
            author {
                id
                name
            }
        }
    }
`;

const UPDATE_POST = gql`
    mutation updatePost($id: String!, $input: PostUpdateInput!) {
        updatePost(id: $id, input: $input) {
            id
            title
            category
            author {
                id
                name
            }
        }
    }
`;

const DELETE_POST = gql`
    mutation updatePost($id: String!) {
        deletePost(id: $id) {
            id
        }
    }
`;

beforeAll(async () => {
    await prisma.post.deleteMany({ where: { title: 'Integration Test Post' } });
    await prisma.user.deleteMany({ where: { email } });
    await prisma.user.create({
        data: {
            email,
            name,
            password: await hash(password, SALT_ROUNDS),
            isAdmin: false,
        },
    });
});

afterAll(async () => {
    await prisma.post.deleteMany({ where: { id: postId } });
    await prisma.user.deleteMany({ where: { email } });
    await prisma.disconnect();
});

describe('Mutations', () => {
    it('login', async () => {
        const { server } = await constructTestServer();
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: LOGIN,
            variables: {
                email,
                password,
            },
        });
        const token = res.data?.login.token;
        expect(res.errors).toBeUndefined();
        expect(token).not.toBeUndefined();
        request = { headers: { authorization: token } };
    });
    it('createPost', async () => {
        const { server } = await constructTestServer(request);
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: CREATE_POST,
            variables: {
                title: 'Integration Test Post',
                category: 'CAREER',
            },
        });
        postId = res.data?.createPost.id;
        expect(res.errors).toBeUndefined();
        expect(res.data?.createPost.title).toBe('Integration Test Post');
        expect(res.data?.createPost.category).toBe('CAREER');
        expect(res.data?.createPost.author.name).toBe(name);
    });
    it('createPost - Cannot create post without access token', async () => {
        const { server } = await constructTestServer();
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: CREATE_POST,
            variables: {
                title: 'Integration Test Post',
                category: 'CAREER',
            },
        });
        expect(res.data).toBeNull();
    });
    it('updatePost', async () => {
        const { server } = await constructTestServer(request);
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: UPDATE_POST,
            variables: {
                id: postId,
                input: {
                    title: 'Title is changed to something else',
                },
            },
        });
        expect(res.errors).toBeUndefined();
        expect(res.data?.updatePost.title).toBe(
            'Title is changed to something else',
        );
        expect(res.data?.updatePost.category).toBe('CAREER');
    });
    it('deletePost', async () => {
        const { server } = await constructTestServer(request);
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: DELETE_POST,
            variables: { id: postId },
        });
        expect(res.errors).toBeUndefined();
        expect(res.data?.deletePost.id).toBe(postId);
    });
});