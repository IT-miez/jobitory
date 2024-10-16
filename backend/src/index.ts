import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import dotenv from 'dotenv';
import passport from 'passport';
import JwtStrategyConfiguration from './utils/passportSetup.js';
import {ExtractJwt} from 'passport-jwt';
import resolvers from './resolvers.js';
import typeDefs from './typedefs.js';
import {expressMiddleware} from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import http from 'http';

dotenv.config();
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
passport.use(JwtStrategyConfiguration);

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

/*const {url} = await startStandaloneServer(server, {
    listen: {port: 4000},
});
*/
async function startServer() {
    await server.start();

    // Use Apollo Server middleware with Express
    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

    // Start the Express server
    const PORT = 4000; // or any other port
    const httpServer = http.createServer(app);

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
}

startServer();

console.log(`🚀  Server ready !`);
