import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import {upload, deleteCloudinaryImage} from './utils/cloudinary.js';
import {GraphQLError} from 'graphql';
import cloudinary from 'cloudinary';
import {Resolvers} from './generated/graphql.js';
import {prisma} from './index.js';
import {validateLoginUser, validateMakeUser} from './utils/validation.js';
import {GraphQLInvalidArgsError} from './utils/error.js';

const resolvers: Resolvers = {
    Upload: GraphQLUpload,
    Query: {
        accountData: (givenId) => prisma.user.findUnique({where: {id: Number(givenId)}}),
        profileData: async (root, args) => {
            const {id} = args;

            if (!id) {
                throw new GraphQLError('Email argument is required');
            }
            const userProfile = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
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
                throw new GraphQLError(`User with id ${id} not found`);
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

                return userData.experiences.map((exp) => ({
                    company_name: exp.company_name,
                    position: exp.position,
                    city: exp.city,
                    from: exp.from.toISOString(), // Convert Date to ISO string
                    to: exp.to ? exp.to.toISOString() : null, // Convert Date to ISO string, handle null
                    additional_information: exp.additional_information,
                }));
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

                return userData.educations.map((edu) => ({
                    school_name: edu.school_name,
                    degree: edu.degree,
                    subject: edu.subject,
                    city: edu.city,
                    from: edu.from.toISOString(), // Convert Date to ISO string
                    to: edu.to ? edu.to.toISOString() : null, // Convert Date to ISO string, handle null
                    additional_information: edu.additional_information,
                }));
            } catch (error) {
                console.error('Error fetching experiences:', error);
                throw new GraphQLError(`Error fetching experiences: ${error.message}`);
            }
        },

        jobTrackingData: async (root, args, context) => {

            if (!context.user) {
                throw new GraphQLError('User not authenticated');
            }



            try {
                const jobStatusData = await prisma.jobStatus.findMany({});
                /*
                if (!jobStatusData) {
                    return [];
                }
                */

                return jobStatusData.map((jobdata) => (
                    {
                    ...jobdata,
                        apply_time: jobdata.apply_time ? jobdata.apply_time.toISOString() : null,
                        end_time: jobdata.end_time ? jobdata.end_time.toISOString() : null
                    }
                ));
            } catch (error) {
                console.error('Error fetching experiences:', error);
                throw new GraphQLError(`Error fetching experiences: ${error.message}`);
            }
        },
    },

    Mutation: {
        makeUser: async (root, {user}) => {
            await validateMakeUser(user);

            const existingUser = await prisma.user.findUnique({where: {email: user.email}});

            if (existingUser) {
                throw new GraphQLInvalidArgsError('Email already in use', 'email');
            }

            const uploadResult = await upload(user.image);

            const hashedPassword = await bcrypt.hash(user.password, 10);

            return prisma.user.create({
                data: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone_number: user.phone_number,
                    address: user.address,
                    post_code: user.post_code,
                    municipality: user.municipality,
                    password: hashedPassword,
                    ...(uploadResult && {
                        image: {
                            create: {
                                cloudinary_url: uploadResult.url,
                                cloudinary_public_id: uploadResult.public_id,
                            },
                        },
                    }),
                },
            });
        },

        loginUser: async (root, {credentials}) => {
            await validateLoginUser(credentials);

            const user = await prisma.user.findUnique({
                where: {
                    email: credentials.email,
                },
            });

            if (!user) {
                throw new GraphQLInvalidArgsError('Invalid credentials', 'password');
            }

            const isMatch = await bcrypt.compare(credentials.password, user.password);
            if (!isMatch) {
                throw new GraphQLInvalidArgsError('Invalid credentials', 'password');
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
                ...user,
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
        updateUser: async (root, {user}, context) => {
            if (!context.user || !context.user.email) {
                throw new GraphQLError('User not authenticated');
            }

            const {email, first_name, last_name, phone_number, address, post_code, municipality, image} = user;

            if (image) {
                await cloudinary.v2.uploader.destroy(context.user.image.cloudinary_public_id);
            }

            const uploadResult = await upload(image);

            try {
                const updateData = {
                    email,
                    first_name,
                    last_name,
                    phone_number,
                    address,
                    post_code,
                    municipality,
                    ...(uploadResult && {
                        image: {
                            upsert: {
                                create: {
                                    cloudinary_url: uploadResult.url,
                                    cloudinary_public_id: uploadResult.public_id,
                                },
                                update: {
                                    cloudinary_url: uploadResult.url,
                                    cloudinary_public_id: uploadResult.public_id,
                                },
                            },
                        },
                    }),
                };

                const updatedUser = await prisma.user.update({
                    where: {id: user.id},
                    data: updateData,
                    include: {
                        image: true,
                    },
                });

                return {
                    message: 'User updated successfully',
                    user: {
                        ...updatedUser,
                        image_url: updatedUser.image ? updatedUser.image.cloudinary_url : null,
                    },
                };
            } catch (error) {
                console.error('Error updating user:', error);
                throw new GraphQLError(`Error updating user: ${error.message}`);
            }
        },
        createExperience: async (root, args, context) => {
            const userArgs = args.input;
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
                    ...newExperience,
                    from: newExperience.from ? newExperience.from.toISOString() : null,
                    to: newExperience.to ? newExperience.to.toISOString() : null,
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
