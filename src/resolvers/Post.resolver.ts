import {
    Post,
    PostCreateInput,
    PostPaginationArgs,
} from '@entities/Post.entity';
import { User } from '@entities/User.entity';
import { getUserId } from '@utils/helpers';
import { Context } from '@utils/interfaces';
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
        { skip, after, before, first, last, filter }: PostPaginationArgs,
    ) {
        return await prisma.post.findMany({
            where: { OR: [{ title: filter }] },
            skip,
            first,
            last,
            after,
            before,
        });
    }

    @Mutation(() => Post)
    async createPost(
        @Ctx() { prisma, req }: Context,
        @Args() { title, category, published }: PostCreateInput,
    ): Promise<Partial<User>> {
        const { userId }: any = await getUserId({ req, prisma });
        return await prisma.post.create({
            data: {
                author: { connect: { id: userId } },
                title,
                category,
                published,
            },
        });
    }

    @FieldResolver()
    async author(@Ctx() { prisma }: Context, @Root() { id }: Post) {
        return await prisma.post.findOne({ where: { id } }).author();
    }
}
