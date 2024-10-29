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
import jwt from 'jsonwebtoken';
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

            const token = req.headers.authorization || '';
            console.log(token)
            console.log(typeof(token))
            if(!token) {
                const splitToken = token.split(" ")
                const decodedToken = JSON.parse(splitToken[1])
                const validToken = jwt.verify(decodedToken, process.env.SECRET)

                let user = null;

                if (validToken) {
                    user =  await prisma.user.findUnique({where: {email: decodedToken.email}})
                }



                return {
                    user,
                };
            } else {
                return null
            }

        }
    })

);

httpServer.listen({port: 4000});
// eslint-disable-next-line no-console
console.log('🚀 Server ready at http://localhost:4000/graphql');
