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

    socket.emit('getMessages', getMessages(socket));
    
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
  console.log('here getMessages ');
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
    socket.emit('getMessages', messages);
  } catch (error) {
    console.error('Error fetching messages with details:', error);
  }
};

export const onEditMessage = async (
  socket: Socket,
  data: {messageId: string; body: string},
) => {
  // edit msg is like send msg but we just update the body and createdAt
  const {messageId, body} = data;
  const updatedMessage = await Message.findOneAndUpdate(
    {_id: messageId},
    {
      $set: {
        body: body,
        modification: {
          isModified: true,
          modifiedAt: new Date(),
        },
      },
    },
    {new: true, returnOriginal: false},
  );

  // TODO: refactor this emit

  if (updatedMessage) {
    socket.emit('getMessages', getMessages(socket));
  } else {
    console.log('no mss found');
  }
};

export const onDeleteMessage = async (
  socket: Socket,
  data: {messageId: string},
) => {
  const {messageId} = data;
  const deletedMsg = await Message.findByIdAndDelete({_id: messageId});

  console.log(deletedMsg, '--deletedMsg');
  // TODO: refactor this emit
  if (deletedMsg) {
    socket.emit('getMessages', getMessages(socket));
  } else {
    console.log('no mss found');
  }
};
