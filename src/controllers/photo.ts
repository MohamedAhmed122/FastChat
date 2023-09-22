import {v2 as cloudinary} from 'cloudinary';
import {Request, Response} from 'express';
import User from '../models/user';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'No file uploaded'});
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    console.log(result, 'result');
    const user = await User.findByIdAndUpdate(req.params.userId, {
      avatar: result.url,
    });

    return res.status(200).json({user});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Image upload failed'});
  }
};
