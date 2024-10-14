const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GraphQLString } = require('graphql');
const { UserType } = require('../types'); // Assuming you have a UserType defined for GraphQL
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const loginMutation = {
  async resolve(root, args) {
    const user = await prisma.user.findUnique({
      where: {
        username: args.username,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const jwtPayload = {
      id: user.id,
      username: user.username,
    };

    const token = jwt.sign(jwtPayload, process.env.SECRET, {
      expiresIn: '1d',
    });

    return {
      token,
      message: 'ok',
      ...user,
    };
  },
};

export default loginMutation
