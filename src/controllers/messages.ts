import Message from '../models/message';
import {Request, Response} from 'express';

export const getMessagesRequest = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 1;
    const page = Number(req.query.page) || 1;
    const total = await Message.countDocuments();

    const messages = await Message.find()
      .populate('user', 'firstName lastName avatar')
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res
      .status(201)
      .json({success: true, messages, meta: {pageSize, page, total}});
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({success: false, error: 'Failed to fetch messages'});
  }
};
