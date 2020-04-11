import { Context } from '@src/index';
import { ACCESS_TOKEN_SECRET } from '@utils/constants';
import { verify } from 'jsonwebtoken';

export interface Session {
    userId: string;
    iat: number;
    exp: number;
}

export const getUserId = async ({ req }: Context) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    return verify(token, ACCESS_TOKEN_SECRET) as Session;
};
