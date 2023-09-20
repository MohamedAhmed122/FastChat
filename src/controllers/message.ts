import {Socket} from 'socket.io';
import Message from '../models/message';
import Thread from '../models/thread';

// Handle sending a new message
export const sendMessage = async (
  socket: Socket,
  data: {userId: string; body: string},
) => {
  try {
    const message = new Message({
      user: data.userId,
      body: data.body,
    });

    await message.save();

    socket.emit('newMessage', message);

    socket.emit('messageSent', {success: true});
  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('messageSent', {
      success: false,
      error: 'Failed to send message',
    });
  }
};

export const associateMessageWithThread = async (
  socket: Socket,
  data: {messageId: string; threadId: string; replyBody: string},
) => {
  try {
    const {messageId, threadId, replyBody} = data;

    const message = await Message.findById(messageId);

    if (!message) {
      throw new Error('Message not found');
    }

    let thread = await Thread.findById(threadId);

    if (!thread) {
      thread = new Thread({
        user: message.user,
        body: replyBody,
      });

      await thread.save();
    } else {
      thread.body += `\n${replyBody}`;
    }

    await thread.save();
    message.thread = thread;
    await message.save();

    socket.emit('reply', {messageId, threadId});

    socket.emit('replySuccess', {success: true});
  } catch (error) {
    console.error('Error associating message with thread:', error);
    socket.emit('replyFailed', {
      messageId: data.messageId,
      error: 'Failed to associate message with thread',
    });
  }
};

export const getMessages = async (socket: Socket) => {
  try {
    const messages = await Message.find()
      .populate('user', 'firstName lastName avatar')
      .populate({
        path: 'thread',
        model: 'Thread',
        populate: {
          path: 'user',
          model: 'User',
          select: 'firstName lastName avatar',
        },
      });
    socket.emit('getAllMessages', messages);
  } catch (error) {
    console.error('Error fetching messages with details:', error);
  }
};
