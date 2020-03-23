import { PageInfo } from '@entities/PageInfo';
import { PostConnection } from '@entities/Post.entity';
import 'reflect-metadata';
import {
    ArgsType,
    Field,
    ID,
    InputType,
    Int,
    ObjectType,
    registerEnumType,
} from 'type-graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field()
    email: string;

    @Field(() => UserRole)
    role: UserRole;

    @Field(() => PostConnection)
    posts: PostConnection;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;
}

@ObjectType()
export class AuthPayload {
    @Field()
    token: string;

    @Field({ nullable: true })
    refreshToken?: string;
}

@ObjectType()
export class MessagePayload {
    @Field()
    message: string;
}

@InputType()
export class UserCreateInput implements Partial<User> {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    name?: string;

    @Field(() => UserRole)
    role: UserRole;
}

@InputType()
export class UserUpdateInput implements Partial<User> {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;
}

@ObjectType()
export class UserEdge {
    @Field()
    node: User;

    @Field()
    cursor: string;
}

@ObjectType()
export class UserConnection {
    @Field(() => [UserEdge])
    edges: UserEdge[];

    @Field()
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
}

@ArgsType()
export class UserAuthenticationArgs {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;

    @Field(() => String, { nullable: true })
    name?: string;
}

@ArgsType()
export class UserPaginationArgs {
    @Field(() => String, { nullable: true })
    filter?: string;

    @Field(() => Int, { nullable: true })
    skip?: number;

    @Field(() => String, { nullable: true })
    after?: string;

    @Field(() => String, { nullable: true })
    before?: string;

    @Field(() => Int, { nullable: true })
    first?: number;

    @Field(() => Int, { nullable: true })
    last?: number;

    @Field(() => UserOrderByInput, { nullable: true })
    orderBy?: UserOrderByInput;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

registerEnumType(UserRole, { name: 'UserRole' });

export enum UserOrderByInput {
    id_ASC = 'id_ASC',
    id_DESC = 'id_DESC',
    name_ASC = 'name_ASC',
    name_DESC = 'name_DESC',
    email_ASC = 'email_ASC',
    email_DESC = 'email_DESC',
    role_ASC = 'role_ASC',
    role_DESC = 'role_DESC',
    createdAt_ASC = 'createdAt_ASC',
    createdAt_DESC = 'createdAt_DESC',
    updatedAt_ASC = 'updatedAt_ASC',
    updatedAt_DESC = 'updatedAt_DESC',
}

registerEnumType(UserOrderByInput, { name: 'UserOrderByInput' });
