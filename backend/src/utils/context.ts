import jwt from 'jsonwebtoken';
import {ExpressContextFunctionArgument} from '@apollo/server/express4';
import {prisma} from '../index.js';

export async function context({req}: ExpressContextFunctionArgument) {
    const token = req.headers.authorization || '';
    if (token) {
        const splitToken = token.split(' ');
        const decodedToken = JSON.parse(splitToken[1]);
        const validToken = jwt.verify(decodedToken, process.env.SECRET);

        let user = null;

        if (validToken) {
            user = await prisma.user.findUnique({where: {email: decodedToken.email}, include: {image: true}});
        }

        return {
            user,
        };
    } else {
        return null;
    }
}
