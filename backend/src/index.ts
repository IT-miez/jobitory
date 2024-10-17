import dotenv from 'dotenv';
import {ApolloServer} from '@apollo/server';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import {expressMiddleware} from '@apollo/server/express4';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import cors from 'cors';
import express from 'express';
import http from 'http';
import resolvers from './resolvers.js';
import typeDefs from './typedefs.js';
import passport from 'passport';
import JwtStrategyConfiguration from './utils/passportSetup.js';
import { jwtDecode } from "jwt-decode";

dotenv.config();
passport.use(JwtStrategyConfiguration);

interface AuthContext {
    user?: {
        token: string;
        email: string;
        first_name: string;
        last_name: string;
    };
}


const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<AuthContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
    context: async ({ req }: ExpressContext): Promise<AuthContext> => {
        const token = req.headers.authorization || '';

        let user;
        try {
            if (token) {
                user = await jwtDecode(token);
            }
        } catch (error) {
            console.error('Invalid token:', error);
        }

        return {
            user,
        };
    },
});
await server.start();

app.use(
    '/graphql',
    cors(),
    graphqlUploadExpress({maxFileSize: 4194304, maxFiles: 1}),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }) => {

            const token = req.headers.token || '';
            console.log('Extracted token:', token);

            let user = null;
            if (token) {
                user = await jwtDecode(token);
            }

            console.log('Context user:', user);

            return {
                user,
            };
    })

);

httpServer.listen({port: 4000});

console.log('🚀 Server ready at http://localhost:4000/graphql');
