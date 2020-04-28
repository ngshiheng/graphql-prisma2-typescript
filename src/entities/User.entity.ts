import { Post } from '@entities/Post.entity';
import { OrderByArg } from '@src/entities/Pagination.entity';
import 'reflect-metadata';
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field()
    email: string;

    @Field()
    isAdmin: boolean;

    @Field(() => [Post], { nullable: true })
    posts: Post[];

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

@ObjectType()
export class AuthPayload {
    @Field()
    token: string;
}

@ObjectType()
export class MessagePayload {
    @Field({ description: 'Message that is returned to the user' })
    message: string;
}

@ArgsType()
export class UserCreateInput implements Partial<User> {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    isAdmin?: boolean;
}

@ArgsType()
export class UserRegisterArgs implements Partial<User> {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    name?: string;
}

@ArgsType()
export class UserLoginArgs implements Partial<User> {
    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class UserUpdateInput implements Partial<User> {
    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    isAdmin?: boolean;
}

@InputType()
export class UserWhereUniqueInput implements Partial<User> {
    @Field(() => ID, { nullable: true })
    id?: string;

    @Field(() => String, { nullable: true })
    email?: string;
}

@InputType()
export class UserOrderByInput {
    @Field(() => OrderByArg, { nullable: true })
    id?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    name?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    email?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    isAdmin?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    createdAt?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    updatedAt?: OrderByArg;
}

@ArgsType()
export class UserPaginationArgs {
    @Field(() => String, { nullable: true })
    filter?: string;

    @Field({ nullable: true })
    skip?: number;

    @Field(() => UserOrderByInput, { nullable: true })
    orderBy?: UserOrderByInput;

    @Field(() => UserWhereUniqueInput, { nullable: true })
    after?: UserWhereUniqueInput;

    @Field(() => UserWhereUniqueInput, { nullable: true })
    before?: UserWhereUniqueInput;

    @Field({ nullable: true })
    first?: number;

    @Field({ nullable: true })
    last?: number;
}
