import { ACCESS_TOKEN_SECRET } from '@utils/constants';
import { Context } from '@utils/interfaces';
import { verify } from 'jsonwebtoken';

export const getUserId = async ({ req }: Context) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    return verify(token, ACCESS_TOKEN_SECRET);
};
