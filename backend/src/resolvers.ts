import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import upload from './utils/cloudinary.js';
import {GraphQLError} from 'graphql';
import cloudinary from 'cloudinary';

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
                    console.log(error);
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
                            cloudinary_public_id: imageURL.public_id
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
        deleteUser: async (root, {email}, context) => {
            console.log(context)
            if (!context.user || !context.user.email) {
                console.log("User is undefined or email is missing");
                throw new GraphQLError('User not authenticated');
            }

            if (context.user.email !== email) {
                console.log("not the same email")
                throw new GraphQLError('You are not authorized to delete this user');
            }

            if (context.user.email == email) {
                console.log("SAME EMAIL")
            }

            try {
                const userInfo = await prisma.user.findUnique({where: {email: context.user.email}});
                console.log(userInfo)
                console.log(userInfo.id)

                const deletedImage = await prisma.image.delete({where: {user_id: userInfo.id}})

                const deletedUser = await prisma.user.delete({
                    where: {
                        email: email
                    }
                });
                console.log(deletedUser)

                return {
                    message: `Deleted user with email: ${deletedUser.email}`
                };

            } catch (error) {
                console.log("FUll errror", error)
                throw new GraphQLError(`Error deleting user: ${error.message}`);
            }
        },
        updateUser: async (root, {input}, context) => {
            const {user} = context;

            if (!user || !user.email) {
                throw new GraphQLError('User not authenticated');
            }

            const {
                email,
                first_name,
                last_name,
                phone_number,
                address,
                post_code,
                municipality,
                image,
            } = input;

            let imageURL;

            cloudinary.v2.uploader
                .destroy(user.image.cloudinary_public_id)
                .then(result => console.log(result));

            if (image) {
                try {
                    imageURL = await upload(image);
                    console.log("Uploaded Image URL:", imageURL);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    throw new GraphQLError('Error on image upload');
                }
            }

            try {
                const updateData = {
                    email,
                    first_name,
                    last_name,
                    phone_number,
                    address,
                    post_code,
                    municipality,
                    ...(imageURL && {
                        image: {
                            upsert: {
                                create: {cloudinary_url: imageURL.url, cloudinary_public_id: imageURL.public_id},
                                update: {cloudinary_url: imageURL.url, cloudinary_public_id: imageURL.public_id},
                            },
                        },
                    }),
                };

                const updatedUser = await context.prisma.user.update({
                    where: {email: user.email},
                    data: updateData,
                });

                return {
                    message: 'User updated successfully',
                    user: updatedUser,
                };
            } catch (error) {
                console.error("Error updating user:", error);
                throw new GraphQLError(`Error updating user: ${error.message}`);
            }
        },
        createExperience: async (root, input, context) => {
            const userArgs = input.input
            if (!context.user || !context.user.email) {
                throw new GraphQLError('User not authenticated');
            }

            try {
                let userData = await prisma.userData.findUnique({
                    where: {
                        id: context.user.id,
                    },
                });

                if (!userData) {
                    userData = await prisma.userData.create({
                        data: {
                            user: {
                                connect: {
                                    id: context.user.id,
                                },
                            },
                        },
                    });
                }

                // Create the new Experience
                const newExperience = await prisma.experience.create({
                    data: {
                        company_name: userArgs.company_name,
                        position: userArgs.position,
                        city: userArgs.city,
                        from: userArgs.from,
                        to: userArgs.to,
                        additional_information: userArgs.additional_information,
                        user: {
                            connect: {
                                id: userData.id,
                            },
                        },
                    },
                });
                console.log("NEW EXPERIENCE:")
                console.log(newExperience)
                return {
                    message: 'Experience created successfully',
                    experience: newExperience,
                };
            } catch (error) {
                console.error("Error creating experience:", error);
                throw new GraphQLError(`Error creating experience: ${error.message}`);
            }
        },
    }
};

export default resolvers;
