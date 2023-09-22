import express from 'express';
import {createUser, getAllUsers} from '../controllers/user';
import multer from 'multer';
import {uploadPhoto} from '../controllers/photo';

const router = express.Router();

const upload = multer({dest: '../uploads/'});

router.route('/').get(getAllUsers).post(createUser);

router.route('/photo/:userId').post(upload.single('avatar'), uploadPhoto);

export default router;
