import {
    AuthPayload,
    MessagePayload,
    User,
    UserCreateInput,
    UserLoginArgs,
    UserPaginationArgs,
    UserRegisterArgs,
    UserUpdateInput,
} from '@entities/User.entity';
import { Post } from '@prisma/*';
import { Context } from '@src/index';
import { sendPasswordResetEmail } from '@src/utils/mailer';
import {
    ACCESS_TOKEN_EXPIRY,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    SALT_ROUNDS,
} from '@utils/constants';
import { getUserId, Session } from '@utils/helpers';
import { ApolloError } from 'apollo-server';
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import {
    Arg,
    Args,
    Ctx,
    FieldResolver,
    Mutation,
    Query,
    Resolver,
    Root,
} from 'type-graphql';

export interface PasswordResetSession {
    userEmail: string;
    currentPassword: string;
}

@Resolver(User)
export class UserResolvers {
    @Query(() => User)
    async me(@Ctx() { prisma, req }: Context) {
        const { userId }: Session = await getUserId({ req, prisma });
        return await prisma.user.findOne({ where: { id: userId } });
    }

    @Query(() => User)
    async user(@Ctx() { prisma }: Context, @Arg('id') id: string) {
        const user = await prisma.user.findOne({ where: { id } });
        if (!user) {
            throw new ApolloError('User does not exist');
        }
        return user;
    }

    @Query(() => [User])
    async users(
        @Ctx() { prisma }: Context,
        @Args()
        { filter, ...args }: UserPaginationArgs,
    ) {
        return await prisma.user.findMany({
            where: { OR: [{ email: filter }, { name: filter }] },
            ...args,
        });
    }

    @Mutation(() => User)
    async createUser(
        @Ctx() { prisma }: Context,
        @Args() { email, password, ...inputs }: UserCreateInput,
    ) {
        const user = await prisma.user.findOne({ where: { email } });
        if (user) {
            throw new ApolloError('Email is already registered');
        }
        const hashedPassword = await hash(password, SALT_ROUNDS);
        return await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                ...inputs,
            },
        });
    }

    @Mutation(() => User)
    async register(
        @Ctx() { prisma }: Context,
        @Args() { email, password, ...args }: UserRegisterArgs,
    ) {
        const user = await prisma.user.findOne({ where: { email } });
        if (user) {
            throw new ApolloError('Email is already registered');
        }
        const hashedPassword = await hash(password, SALT_ROUNDS);
        return await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                ...args,
            },
        });
    }

    @Mutation(() => AuthPayload)
    async login(
        @Ctx() { prisma }: Context,
        @Args() { email, password }: UserLoginArgs,
    ): Promise<AuthPayload> {
        const user = await prisma.user.findOne({ where: { email } });
        if (!user) {
            throw new ApolloError('User does not exist'); // Note: Use ambiguous error message in production
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApolloError('Incorrect password');
        }
        const token = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
        const refreshToken = sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        });
        await prisma.user.update({
            where: { email },
            data: { refreshToken },
        });
        return { token, refreshToken };
    }

    @Mutation(() => User)
    async updateUser(
        @Ctx() { prisma, req }: Context,
        @Arg('id') id: string,
        @Arg('input') input: UserUpdateInput,
    ): Promise<Partial<Post>> {
        const { userId }: Session = await getUserId({ req, prisma });
        const user = await prisma.user.findOne({
            where: { id },
            select: { id: true },
        });
        if (!user) {
            throw new ApolloError('User does not exist');
        } else {
            if (user.id === userId) {
                return await prisma.user.update({
                    where: { id },
                    data: { ...input },
                });
            }
            throw new ApolloError('You do not own this account');
        }
    }

    @Mutation(() => User)
    async deleteUser(@Ctx() { prisma, req }: Context, @Arg('id') id: string) {
        const { userId }: Session = await getUserId({ req, prisma });
        const user = await prisma.user.findOne({ where: { id } });
        if (!user) {
            throw new ApolloError('User does not exist');
        } else {
            if (user.id === userId) {
                return await prisma.user.delete({ where: { id } });
            }
            throw new ApolloError('You do not own this account');
        }
    }

    @Mutation(() => [User])
    async deleteUsers(@Ctx() { prisma }: Context) {
        const users = await prisma.user.findMany();
        await prisma.user.deleteMany({});
        return users;
    }

    @Mutation(() => MessagePayload)
    async resetPassword(
        @Ctx() { prisma }: Context,
        @Arg('email') email: string,
    ): Promise<MessagePayload> {
        const user = await prisma.user.findOne({ where: { email } });
        if (!user) {
            throw new ApolloError('User does not exist');
        }
        const token = sign(
            { userEmail: email, currentPassword: user.password },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRY,
            },
        );
        sendPasswordResetEmail(email, token);
        return {
            message: 'Password reset email sent. Please check your inbox',
        };
    }

    @Mutation(() => MessagePayload)
    async updatePassword(
        @Ctx() { prisma, req }: Context,
        @Arg('password') password: string,
    ): Promise<MessagePayload> {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        const { userEmail, currentPassword } = verify(
            token,
            ACCESS_TOKEN_SECRET,
        ) as PasswordResetSession;
        const user = await prisma.user.findOne({
            where: { email: userEmail },
        });
        if (!user) {
            throw new ApolloError('User does not exist');
        }
        if (user.password === currentPassword) {
            const hashedPassword = await hash(password, SALT_ROUNDS);
            await prisma.user.update({
                where: { email: userEmail },
                data: { password: hashedPassword },
            });
            return {
                message:
                    'Password reset successful. You may now login with your new password',
            };
        } else {
            throw new ApolloError(
                'You may only reset your password once with the current token',
            );
        }
    }

    @Mutation(() => AuthPayload)
    async refreshLogin(
        @Ctx() { prisma, req }: Context,
        @Arg('refreshToken') refreshToken: string,
    ): Promise<AuthPayload> {
        const { userId }: Session = await getUserId({ req, prisma });
        const user = await prisma.user.findOne({ where: { id: userId } });
        if (user?.refreshToken === refreshToken) {
            const isValid = verify(refreshToken, REFRESH_TOKEN_SECRET);
            if (isValid) {
                const newAccessToken = sign({ userId }, ACCESS_TOKEN_SECRET, {
                    expiresIn: ACCESS_TOKEN_EXPIRY,
                });
                const newRefreshToken = sign({ userId }, REFRESH_TOKEN_SECRET, {
                    expiresIn: REFRESH_TOKEN_EXPIRY,
                });
                await prisma.user.update({
                    where: { id: userId },
                    data: { refreshToken: newRefreshToken },
                });
                return {
                    token: newAccessToken,
                    refreshToken: newRefreshToken,
                };
            } else {
                throw new ApolloError(
                    'Your refresh token has expired, please login again',
                );
            }
        } else {
            throw new ApolloError(
                'Your refresh token is invalid, please login again',
            );
        }
    }

    @FieldResolver()
    async posts(
        @Ctx() { prisma }: Context,
        @Root() { id }: User,
    ): Promise<Post[]> {
        return await prisma.user.findOne({ where: { id } }).posts();
    }
}
