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
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

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
});
await server.start();

app.use(
    '/graphql',
    cors(),
    graphqlUploadExpress({maxFileSize: 4194304, maxFiles: 1}),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }) => {

            let token = req.headers.authorization || '';
            if (Array.isArray(token)) {
                token = token[0];
            }

            token = token || '';

            let user = null;
            let tokenUser = null;
            if (token) {
                tokenUser = await jwtDecode(token);
            }
            if (tokenUser) {
                user =  await prisma.user.findUnique({where: {email: tokenUser.email}})
            }



            return {
                user,
            };
        }
    })

);

httpServer.listen({port: 4000});

console.log('🚀 Server ready at http://localhost:4000/graphql');
