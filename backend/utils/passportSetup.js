import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';


// Prisma
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() 

// JWT SETUP
import bcrypt from 'bcryptjs';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

//const User = require('../models/user');

const JwtStrategyConfiguration = new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.SECRET }, (async (jwtPayload, done) => {
  try {
    const user = await prisma.user.findOne({ username: jwtPayload.username });
    
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));
// JWT SETUP DONE
// module.exports = JwtStrategyConfiguration;

export default JwtStrategyConfiguration
