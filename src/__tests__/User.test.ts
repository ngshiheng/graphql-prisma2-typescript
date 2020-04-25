import { Context } from '@src/index';
import { ApolloServer } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import { Request } from 'express';
import gql from 'graphql-tag';
import { join } from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '../generated/prisma-client/index';

const prisma = new PrismaClient();
let id: string;
let name: string = 'User.test.ts';
let email: string = 'user-integration@test.com';
const password: string = 'test-password-123';
let request: Partial<Request>;
let unauthorizedRequest = {
    headers: {
        authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjazlmano4ZnowMDAwdWRta21hOHBvZ2E5IiwiaWF0IjoxNTg3ODE1ODYwLCJleHAiOjE1ODc4MTY3NjB9.rQzhzoZq-1ckgs4LWCMTg2_ssJy3NR2Qyg-gqmxti4o',
    },
};

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

const REGISTER = gql`
    mutation register($email: String!, $password: String!, $name: String) {
        register(email: $email, password: $password, name: $name) {
            id
            name
            email
            isAdmin
        }
    }
`;

const DELETE_USER = gql`
    mutation deleteUser($id: String!) {
        deleteUser(id: $id) {
            id
            name
            email
        }
    }
`;

const UPDATE_USER = gql`
    mutation updateUser($id: String!, $input: UserUpdateInput!) {
        updateUser(id: $id, input: $input) {
            id
            name
            email
        }
    }
`;

beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
});

afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.disconnect();
});

describe('Mutations', () => {
    it('register', async () => {
        const { server } = await constructTestServer();
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: REGISTER,
            variables: {
                email,
                password,
                name,
            },
        });
        id = res.data?.register.id;
        expect(res.errors).toBeUndefined();
        expect(res.data?.register.id).not.toBeUndefined();
        expect(res.data?.register.name).toBe(name);
        expect(res.data?.register.email).toBe(email);
        expect(res.data?.register.isAdmin).toBeFalsy();
    });
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
    it('updateUser - Unauthorized user cannot update the user', async () => {
        const { server } = await constructTestServer(unauthorizedRequest);
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: UPDATE_USER,
            variables: { id, input: { email: 'updated_email@test.com' } },
        });
        expect(res.data).toBeNull();
        expect(res.errors).toHaveLength(1);
    });
    it('updateUser - Only owner can update their own user details', async () => {
        const { server } = await constructTestServer(request);
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: UPDATE_USER,
            variables: {
                id,
                input: {
                    email: 'updated_email@test.com',
                    name: 'Updated User Name',
                },
            },
        });
        email = res.data?.updateUser.email;
        name = res.data?.updateUser.name;
        expect(res.errors).toBeUndefined();
        expect(res.data?.updateUser.id).toBe(id);
        expect(res.data?.updateUser.name).toBe('Updated User Name');
        expect(res.data?.updateUser.email).toBe('updated_email@test.com');
    });
    it('deleteUser - Unauthorized user cannot delete the user', async () => {
        const { server } = await constructTestServer(unauthorizedRequest);
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: DELETE_USER,
            variables: { id },
        });
        expect(res.data).toBeNull();
        expect(res.errors).toHaveLength(1);
    });
    it('deleteUser - Only owner can delete their own user', async () => {
        const { server } = await constructTestServer(request);
        const { mutate } = createTestClient(server);
        const res = await mutate({
            mutation: DELETE_USER,
            variables: { id },
        });
        expect(res.errors).toBeUndefined();
        expect(res.data?.deleteUser.id).toBe(id);
        expect(res.data?.deleteUser.name).toBe(name);
        expect(res.data?.deleteUser.email).toBe(email);
    });
});