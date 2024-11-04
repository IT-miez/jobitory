import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {prisma} from '../index.js';

const JwtStrategyConfiguration = new JwtStrategy(
    {jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.SECRET},
    async (jwtPayload, done) => {
        try {
            const user = await prisma.user.findUnique({where: {email: jwtPayload.email}});

            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (err) {
            return done(err, false);
        }
    }
);

export default JwtStrategyConfiguration;
