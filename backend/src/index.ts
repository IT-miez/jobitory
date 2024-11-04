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
import {makeExecutableSchema} from '@graphql-tools/schema';
import {context} from './utils/context.js';
import {PrismaClient, Prisma} from '@prisma/client';
export const prisma = new PrismaClient();

dotenv.config();
passport.use(JwtStrategyConfiguration);

export interface AuthContext {
    user?: Prisma.UserGetPayload<{include: {image: true}}>;
}

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const server = new ApolloServer<AuthContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
});
await server.start();

app.use(
    '/graphql',
    cors(),
    graphqlUploadExpress({maxFileSize: 4194304, maxFiles: 1}),
    express.json(),
    expressMiddleware(server, {
        context,
    })
);

httpServer.listen({port: 4000});
// eslint-disable-next-line no-console
console.log('🚀 Server ready at http://localhost:4000/graphql');
