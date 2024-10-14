import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import JwtStrategyConfiguration from './utils/passportSetup.js';
import jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import resolvers from './resolvers.js';
import typeDefs from './typedefs.js';


const prisma = new PrismaClient() 
dotenv.config();
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
passport.use(JwtStrategyConfiguration);

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.





// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});



// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);