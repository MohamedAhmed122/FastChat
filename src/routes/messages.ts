import express from 'express';
import {getMessagesRequest} from '../controllers/messages';

const router = express.Router();

router.route('/').get(getMessagesRequest);

export default router;
