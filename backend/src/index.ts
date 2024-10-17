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

dotenv.config();
passport.use(JwtStrategyConfiguration);

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
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
    expressMiddleware(server)
);

httpServer.listen({port: 4000});

console.log('🚀 Server ready at http://localhost:4000/graphql');
