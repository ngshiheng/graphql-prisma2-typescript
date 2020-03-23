import {
    AuthPayload,
    User,
    UserAuthenticationArgs,
} from '@entities/User.entity';
import {
    ACCESS_TOKEN_EXPIRY,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
} from '@utils/constants';
import { Context } from '@utils/interfaces';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';

@Resolver(User)
export class UserResolvers {
    @Query(() => User)
    async user(@Ctx() { prisma }: Context, @Arg('id') id: string) {
        const user = await prisma.user.findOne({ where: { id } });
        if (!user) {
            throw new Error('User does not exist');
        }
        return user;
    }

    @Mutation(() => User)
    async register(
        @Ctx() { prisma }: Context,
        @Args() { email, password, name }: UserAuthenticationArgs,
    ) {
        const userEmail = await prisma.user.findOne({ where: { email } });
        if (userEmail) {
            throw new Error('Email is already registered');
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

    @Mutation(() => AuthPayload)
    async login(
        @Ctx() { prisma }: Context,
        @Args() { email, password }: UserAuthenticationArgs,
    ): Promise<AuthPayload> {
        const user = await prisma.user.findOne({ where: { email } });
        if (!user) {
            throw new Error('User does not exist'); // Note: Use ambiguous error message in production
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Incorrect password');
        }
        const token = sign(
            { userId: user.id, role: user.role },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRY,
            },
        );
        const refreshToken = sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        });
        await prisma.user.update({
            where: { email },
            data: { refreshToken },
        });
        return {
            token,
            refreshToken,
        };
    }
}
