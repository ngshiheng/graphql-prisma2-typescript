import 'reflect-metadata';
import { ArgsType, Field, ObjectType } from 'type-graphql';

@ObjectType({})
export class AuthPayload {
    @Field()
    token: string;

    @Field({ nullable: true })
    refreshToken?: string;
}

@ArgsType()
export class UserAuthenticationArgs {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}
