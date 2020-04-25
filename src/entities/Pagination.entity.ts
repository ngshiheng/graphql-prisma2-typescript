import 'reflect-metadata';
import { registerEnumType } from 'type-graphql';

export enum OrderByArg {
    asc = 'asc',
    desc = 'desc',
}

registerEnumType(OrderByArg, { name: 'OrderByArg' });
