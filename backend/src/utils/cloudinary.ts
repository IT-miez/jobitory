import sharp from 'sharp';
import cloudinary, {UploadApiResponse} from 'cloudinary';
import dotenv from 'dotenv';
import {GraphQLInternalServerError} from './error.js';

dotenv.config();

cloudinary.v2.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const upload = async (image): Promise<UploadApiResponse | undefined> => {
    if (!image) return null;
    try {
        const {createReadStream} = await image;
        const stream = createReadStream();
        const sharpImage = sharp().webp({quality: 75});

        return new Promise((resolve, reject) => {
            const uploader = cloudinary.v2.uploader.upload_stream({folder: 'cloudinary_folder'}, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            stream.pipe(sharpImage).pipe(uploader);
        });
    } catch (error) {
        console.error(error);
        throw new GraphQLInternalServerError('Error on image upload', 'image');
    }
};

const deleteCloudinaryImage = async (cloudinary_public_id) => {
    await cloudinary.v2.uploader.destroy(cloudinary_public_id);
};

export {upload, deleteCloudinaryImage};
