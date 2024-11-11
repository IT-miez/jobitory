import jwt, {JwtPayload} from 'jsonwebtoken';
import {ExpressContextFunctionArgument} from '@apollo/server/express4';
import {prisma} from '../index.js';

type JobitoryJwtPayload = JwtPayload & {id: number}

export async function context({req}: ExpressContextFunctionArgument) {
    const token = req.headers.authorization || '';
    if (token) {
        const splitToken = token.split(' ');
        const decodedToken = JSON.parse(splitToken[1]);
        const validToken = jwt.verify(decodedToken, process.env.SECRET) as JobitoryJwtPayload;

        let user = null;

        if (validToken) {
            user = await prisma.user.findUnique({where: {id: decodedToken.id}, include: {image: true}});
        }

        return {
            user,
        };
    } else {
        return null;
    }
}
