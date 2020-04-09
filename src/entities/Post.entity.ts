import { User } from '@entities/User.entity';
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
export class Post {
    @Field(() => ID)
    id: string;

    @Field()
    title: string;

    @Field(() => Category)
    category: Category;

    @Field(() => User)
    author: User;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

@InputType()
export class PostCreateInput implements Partial<Post> {
    @Field()
    title: string;

    @Field(() => Category)
    category: Category;
}

@InputType()
export class PostUpdateInput implements Partial<Post> {
    @Field({ nullable: true })
    title?: string;

    @Field(() => Category, { nullable: true })
    category?: Category;
}

@ArgsType()
export class PostPaginationArgs {
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

    @Field(() => PostOrderByInput, { nullable: true })
    orderBy?: PostOrderByInput;
}

export enum Category {
    CAREER = 'CAREER',
    EDUCATION = 'EDUCATION',
    FINANCE = 'FINANCE',
    FITNESS = 'FITNESS',
    FOOD = 'FOOD',
    GAMING = 'GAMING',
    HEALTH = 'HEALTH',
    NATURE = 'NATURE',
    OTHER = 'OTHER',
    PETS = 'PETS',
    SPORTS = 'SPORTS',
    TECHNOLOGY = 'TECHNOLOGY',
}

registerEnumType(Category, { name: 'PostCategory' });

export enum PostOrderByInput {
    id_ASC = 'id_ASC',
    id_DESC = 'id_DESC',
    title_ASC = 'title_ASC',
    title_DESC = 'title_DESC',
    category_ASC = 'category_ASC',
    category_DESC = 'category_DESC',
    createdAt_ASC = 'createdAt_ASC',
    createdAt_DESC = 'createdAt_DESC',
    updatedAt_ASC = 'updatedAt_ASC',
    updatedAt_DESC = 'updatedAt_DESC',
}

registerEnumType(PostOrderByInput, { name: 'PostOrderByInput' });
