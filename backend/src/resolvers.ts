import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import {upload, deleteCloudinaryImage} from './utils/cloudinary.js';
import {GraphQLError} from 'graphql';
import cloudinary from 'cloudinary';

const prisma = new PrismaClient();

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        accountData: (givenId) => prisma.user.findUnique({where: {id: givenId}}),
        profileData: async (root, args) => {
            const {email} = args;

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
                        },
                    },
                },
            });

            if (!userProfile) {
                throw new GraphQLError(`User with email ${email} not found`);
            }

            return {
                ...userProfile,
                image_url: userProfile.image ? userProfile.image.cloudinary_url : null,
            };
        },
        experiencesData: async (root, args, context) => {
            if (!context.user || !args.email) {
                throw new GraphQLError('User not authenticated');
            }

            try {
                const userData = await prisma.userData.findUnique({
                    where: {
                        user_id: context.user.id,
                    },
                    include: {
                        experiences: true,
                    },
                });

                if (!userData || !userData.experiences) {
                    return [];
                }

                const experiencesWithoutIds = userData.experiences.map((exp) => ({
                    company_name: exp.company_name,
                    position: exp.position,
                    city: exp.city,
                    from: exp.from.toISOString(), // Convert Date to ISO string
                    to: exp.to ? exp.to.toISOString() : null, // Convert Date to ISO string, handle null
                    additional_information: exp.additional_information,
                }));
                return experiencesWithoutIds;
            } catch (error) {
                console.error('Error fetching experiences:', error);
                throw new GraphQLError(`Error fetching experiences: ${error.message}`);
            }
        },
        educationsData: async (root, args, context) => {
            if (!context.user || !args.email) {
                throw new GraphQLError('User not authenticated');
            }

            try {
                const userData = await prisma.userData.findUnique({
                    where: {
                        user_id: context.user.id,
                    },
                    include: {
                        educations: true,
                    },
                });

                if (!userData || !userData.educations) {
                    return [];
                }

                const educationsWithoutIds = userData.educations.map((edu) => ({
                    school_name: edu.school_name,
                    degree: edu.degree,
                    subject: edu.subject,
                    city: edu.city,
                    from: edu.from.toISOString(), // Convert Date to ISO string
                    to: edu.to ? edu.to.toISOString() : null, // Convert Date to ISO string, handle null
                    additional_information: edu.additional_information,
                }));
                return educationsWithoutIds;
            } catch (error) {
                console.error('Error fetching experiences:', error);
                throw new GraphQLError(`Error fetching experiences: ${error.message}`);
            }
        },
    },

    Mutation: {
        makeUser: async (root, args) => {
            const user = {...args};

            const uniqueUser = await prisma.user.findUnique({where: {email: user.email}});
            if (uniqueUser) {
                throw new GraphQLError(`Email is already in use`);
            }
            let imageURL = null;

            const hashedPassword = await bcrypt.hash(user.password, 10);

            if (user.image) {
                try {
                    imageURL = await upload(user.image);
                } catch (error) {
                    console.error(error);
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
                            cloudinary_public_id: imageURL.public_id,
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
            if (!context.user || !context.user.email) {
                console.error('User is undefined or email is missing');
                throw new GraphQLError('User not authenticated');
            }

            if (context.user.email !== email) {
                console.error('not the same email');
                throw new GraphQLError('You are not authorized to delete this user');
            }

            try {
                const userInfo = await prisma.user.findUnique({where: {email: context.user.email}});

                const deletedImage = await prisma.image.delete({where: {user_id: userInfo.id}});

                await deleteCloudinaryImage(deletedImage.cloudinary_public_id);

                const deletedUser = await prisma.user.delete({
                    where: {
                        email: email,
                    },
                });

                return {
                    message: `Deleted user with email: ${deletedUser.email}`,
                };
            } catch (error) {
                throw new GraphQLError(`Error deleting user: ${error.message}`);
            }
        },
        updateUser: async (root, {input}, context) => {
            const {user} = context;

            if (!user || !user.email) {
                throw new GraphQLError('User not authenticated');
            }

            const {email, first_name, last_name, phone_number, address, post_code, municipality, image} = input;

            let imageURL;

            await cloudinary.v2.uploader.destroy(user.image.cloudinary_public_id);

            if (image) {
                try {
                    imageURL = await upload(image);
                } catch (error) {
                    console.error('Error uploading image:', error);
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
                console.error('Error updating user:', error);
                throw new GraphQLError(`Error updating user: ${error.message}`);
            }
        },
        createExperience: async (root, input, context) => {
            const userArgs = input.input;
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
                return {
                    message: 'Experience created successfully',
                    experience: newExperience,
                };
            } catch (error) {
                console.error('Error creating experience:', error);
                throw new GraphQLError(`Error creating experience: ${error.message}`);
            }
        },
        deleteExperience: async (root, args, context) => {
            const experience_id = args.experience_id;
            if (!context.user || !context.user.email) {
                throw new GraphQLError('User not authenticated');
            }

            try {
                const experience = await prisma.experience.findUnique({
                    where: {
                        id: experience_id,
                    },
                    include: {
                        user: true, // Include user data to check ownership
                    },
                });

                if (!experience || experience.user.user_id !== context.user.id) {
                    throw new GraphQLError('Experience not found or not authorized to delete');
                }

                const deletedExperience = await prisma.experience.delete({
                    where: {
                        id: experience_id,
                    },
                });

                return {
                    message: `Deleted experience with id: ${deletedExperience.id}`,
                };
            } catch (error) {
                console.error('Error deleting experience:', error);
                throw new GraphQLError(`Error deleting experience: ${error.message}`);
            }
        },
        deleteEducation: async (root, args, context) => {
            const education_id = args.education_id;
            if (!context.user || !context.user.email) {
                throw new GraphQLError('User not authenticated');
            }
            try {
                const experience = await prisma.education.findUnique({
                    where: {
                        id: education_id,
                    },
                    include: {
                        user: true,
                    },
                });

                if (!experience || experience.user.user_id !== context.user.id) {
                    throw new GraphQLError('Education not found or not authorized to delete');
                }

                const deletedExperience = await prisma.education.delete({
                    where: {
                        id: education_id,
                    },
                });

                return {
                    message: `Deleted education with id: ${deletedExperience.id}`,
                };
            } catch (error) {
                console.error('Error deleting education:', error);
                throw new GraphQLError(`Error deleting education: ${error.message}`);
            }
        },
        deleteImage: async (root, args, context) => {
            if (!context.user || !context.user.email) {
                throw new GraphQLError('User not authenticated');
            }

            try {
                const userImage = await prisma.image.findUnique({
                    where: {
                        user_id: context.user.id,
                    },
                });

                if (!userImage || !userImage.cloudinary_public_id) {
                    throw new GraphQLError('No image found for the user.');
                }

                await deleteCloudinaryImage(userImage.cloudinary_public_id);

                await prisma.image.delete({
                    where: {
                        user_id: context.user.id, // Ensure the image record is removed
                    },
                });

                return {
                    message: 'Image deleted successfully',
                };
            } catch (error) {
                console.error('Error deleting image:', error);
                throw new GraphQLError(`Error deleting user's image: ${error.message}`);
            }
        },
    },
};

export default resolvers;
