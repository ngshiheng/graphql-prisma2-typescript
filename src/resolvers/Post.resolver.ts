import {
    Post,
    PostCreateInput,
    PostPaginationArgs,
    PostUpdateInput,
} from '@entities/Post.entity';
import { User } from '@entities/User.entity';
import { Context } from '@src/index';
import { getUserId, Session } from '@utils/helpers';
import { ApolloError } from 'apollo-server';
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

@Resolver(Post)
export class PostResolvers {
    @Query(() => Post)
    async post(
        @Ctx() { prisma }: Context,
        @Arg('id') id: string,
    ): Promise<Partial<User>> {
        const post = await prisma.post.findOne({ where: { id } });
        if (!post) {
            throw new ApolloError('Post does not exist');
        }
        return post;
    }

    @Query(() => [Post])
    async posts(
        @Ctx() { prisma }: Context,
        @Args()
        { filter, ...args }: PostPaginationArgs,
    ) {
        return await prisma.post.findMany({
            where: { OR: [{ title: filter }] },
            ...args,
        });
    }

    @Mutation(() => Post)
    async createPost(
        @Ctx() { prisma, req }: Context,
        @Args() { ...inputs }: PostCreateInput,
    ): Promise<Partial<User>> {
        const { userId }: Session = await getUserId({ req, prisma });
        return await prisma.post.create({
            data: {
                author: { connect: { id: userId } },
                ...inputs,
            },
        });
    }

    @Mutation(() => Post)
    async updatePost(
        @Ctx() { prisma, req }: Context,
        @Arg('id') id: string,
        @Arg('input') { ...inputs }: PostUpdateInput,
    ) {
        const { userId }: Session = await getUserId({ req, prisma });
        const post = await prisma.post.findOne({
            where: { id },
        });
        if (!post) {
            throw new ApolloError('Post does not exist');
        } else {
            if (post.authorId === userId) {
                return await prisma.post.update({
                    where: { id },
                    data: { ...inputs },
                });
            } else {
                throw new ApolloError(
                    'Access denied. You are not the author of the post',
                );
            }
        }
    }

    @Mutation(() => Post)
    async deletePost(@Ctx() { prisma, req }: Context, @Arg('id') id: string) {
        const { userId }: Session = await getUserId({ req, prisma });
        const post = await prisma.post.findOne({
            where: { id },
            select: { authorId: true },
        });
        if (!post) {
            throw new ApolloError('Post does not exist');
        } else {
            if (post.authorId === userId) {
                return await prisma.post.delete({
                    where: { id },
                });
            } else {
                throw new ApolloError(
                    'Access denied. You are not the author of the post',
                );
            }
        }
    }

    @FieldResolver()
    async author(@Ctx() { prisma }: Context, @Root() { id }: Post) {
        return await prisma.post.findOne({ where: { id } }).author();
    }
}
