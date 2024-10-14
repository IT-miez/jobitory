import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import dotenv from 'dotenv';
import passport from 'passport';
import JwtStrategyConfiguration from './utils/passportSetup.js';
import {ExtractJwt} from 'passport-jwt';
import resolvers from './resolvers.js';
import typeDefs from './typedefs.js';

dotenv.config();
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
passport.use(JwtStrategyConfiguration);

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const {url} = await startStandaloneServer(server, {
	listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);
