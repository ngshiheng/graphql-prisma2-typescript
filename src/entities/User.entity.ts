import 'reflect-metadata';
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql';
import { Post } from './Post.entity';

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

    @Field(() => [Post])
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

@InputType()
export class UserCreateInput implements Partial<User> {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    name?: string;

    @Field()
    isAdmin: boolean;
}

@InputType()
export class UserUpdateInput implements Partial<User> {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;
}

@ArgsType()
export class UserRegisterArgs {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;

    @Field(() => String, { nullable: true })
    name: string;
}
