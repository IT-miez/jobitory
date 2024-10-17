import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import upload from './utils/cloudinary.js';
import {GraphQLError} from 'graphql';

const prisma = new PrismaClient();

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        accountData: (givenId) => prisma.user.findUnique({where: {id: givenId}}),
        profileData: async (root, args) => {
            const { email } = args;

            if (!email) {
                throw new GraphQLError('Email argument is required');
            }
            const userProfile = await prisma.user.findUnique({
                where: {
                    email: email,
                },
                select: {
                    email: true,
                    first_name: true,
                    last_name: true,
                    phone_number: true,
                    address: true,
                    post_code: true,
                    municipality: true,
                    image: {
                        select: {
                            cloudinary_url: true,
                        }
                    }
                },
            });

            if (!userProfile) {
                throw new GraphQLError(`User with email ${email} not found`);
            }

            return {
                ...userProfile,
                image_url: userProfile.image ? userProfile.image.cloudinary_url : null,
            };
        }
    },
    Mutation: {
        makeUser: async (root, args) => {
            const user = {...args};
            let imageURL = null;

            const hashedPassword = await bcrypt.hash(user.password, 10);

            if (user.image) {
                try {
                    imageURL = await upload(user.image);
                    console.log(imageURL);
                } catch (error) {
                    throw new GraphQLError('Error on image upload');
                }
            }

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
                    image: {
                        create: {
                            cloudinary_url: imageURL.url,
                        },
                    },
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
                throw new GraphQLError('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new GraphQLError('Invalid credentials');
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
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            };
        },
    },
};

export default resolvers;
