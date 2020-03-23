import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PageInfo {
    @Field()
    hasNextPage: Boolean;

    @Field()
    hasPreviousPage: Boolean;

    @Field()
    startCursor: string;

    @Field()
    endCursor: string;
}
