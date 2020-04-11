import { OrderByArg } from '@entities/Generic.entity';
import { User } from '@entities/User.entity';
import 'reflect-metadata';
import {
    ArgsType,
    Field,
    ID,
    InputType,
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

    @Field()
    published: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

@ArgsType()
export class PostCreateInput implements Partial<Post> {
    @Field()
    title: string;

    @Field(() => Category)
    category: Category;

    @Field({ nullable: true })
    published?: boolean;
}

@InputType()
export class PostUpdateInput implements Partial<Post> {
    @Field({ nullable: true })
    title?: string;

    @Field(() => Category, { nullable: true })
    category?: Category;
}

@InputType()
export class PostWhereUniqueInput implements Partial<Post> {
    @Field(() => ID, { nullable: true })
    id?: string;
}

@InputType()
export class PostOrderByInput {
    @Field(() => OrderByArg, { nullable: true })
    id?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    title?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    category?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    published?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    createdAt?: OrderByArg;

    @Field(() => OrderByArg, { nullable: true })
    updatedAt?: OrderByArg;
}

@ArgsType()
export class PostPaginationArgs {
    @Field(() => String, { nullable: true })
    filter?: string;

    @Field({ nullable: true })
    skip?: number;

    @Field(() => PostOrderByInput, { nullable: true })
    orderBy?: PostOrderByInput;

    @Field(() => PostWhereUniqueInput, { nullable: true })
    after?: PostWhereUniqueInput;

    @Field(() => PostWhereUniqueInput, { nullable: true })
    before?: PostWhereUniqueInput;

    @Field({ nullable: true })
    first?: number;

    @Field({ nullable: true })
    last?: number;
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
