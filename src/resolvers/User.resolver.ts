import {
    AuthPayload,
    UserAuthenticationArgs,
} from '@entities/Authentication.entity';
import { Context } from '@utils/interfaces';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import 'reflect-metadata';
import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql';
import { User, UserCreateInput } from '../../prisma/generated/type-graphql';

@Resolver()
export class UserResolver {
    @Mutation(() => AuthPayload)
    async login(
        @Ctx() { prisma }: Context,
        @Args() { email, password }: UserAuthenticationArgs,
    ): Promise<AuthPayload> {
        const user = await prisma.user.findOne({
            where: { email },
        });
        if (!user) {
            throw new Error('User does not exist');
        }
        const isValid = await compare(password, user.password);
        if (isValid) {
            const token = sign({ userId: user.id }, 'access-token-secret', {
                expiresIn: '15m',
            });
            const refreshToken = sign(
                { userId: user.id },
                'refresh-token-secret',
                {
                    expiresIn: '1d',
                },
            );
            await prisma.user.update({
                where: { email },
                data: { refreshToken },
            });
            return {
                token,
                refreshToken,
            };
        } else {
            throw new Error('Invalid password');
        }
    }

    @Mutation(() => User)
    async register(
        @Ctx() { prisma }: Context,
        @Arg('input') { email, password, name }: UserCreateInput,
    ): Promise<User> {
        const user = await prisma.user.findOne({
            where: { email },
        });
        if (user) {
            throw new Error('Email already exist');
        }
        const hashedPassword = await hash(password, 10);
        return await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    }
}
