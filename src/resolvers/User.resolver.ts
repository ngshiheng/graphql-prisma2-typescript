import { AuthPayload, User, UserRegisterArgs } from '@entities/User.entity';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from '@utils/constants';
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

    @Query(() => [User])
    async users(@Ctx() { prisma }: Context) {
        return await prisma.user.findMany();
    }

    @Mutation(() => User)
    async register(
        @Ctx() { prisma }: Context,
        @Args() { email, password, name }: UserRegisterArgs,
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
        @Args() { email, password }: UserRegisterArgs,
    ): Promise<AuthPayload> {
        const user = await prisma.user.findOne({ where: { email } });
        if (!user) {
            throw new Error('User does not exist'); // Note: Use ambiguous error message in production
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Incorrect password');
        }
        const token = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
        return { token };
    }

    @Mutation(() => User)
    async deleteUser(@Ctx() { prisma }: Context, @Arg('id') id: string) {
        const user = await prisma.user.findOne({ where: { id } });
        if (!user) {
            throw new Error('User does not exist');
        }
        return await prisma.user.delete({ where: { id } });
    }
}
