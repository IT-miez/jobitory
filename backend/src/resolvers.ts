import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

const prisma = new PrismaClient();

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        accountData: (givenId) => prisma.user.findUnique({where: {id: givenId}}),
    },
    Mutation: {
        makeUser: async (root, args) => {
            const user = {...args};

            const hashedPassword = await bcrypt.hash(user.password, 10);

            await prisma.user.create({
                data: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone_number: user.phone_number,
                    address: user.address,
                    post_code: user.post_code,
                    municipality: user.municipality,
                    password: hashedPassword,
                },
            });
            return user;
        },

        loginUser: async (root, {email, password}) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            const jwtPayload = {
                id: user.id,
                email: user.email,
            };

            const token = jwt.sign(jwtPayload, process.env.SECRET, {
                expiresIn: '1d',
            });

            return {
                token,
                message: 'ok',
            };
        },
    },
};

export default resolvers;
