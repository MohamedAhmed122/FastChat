import {Server} from 'socket.io';
import {
  associateMessageWithThread,
  getMessages,
  onDeleteMessage,
  onEditMessage,
  sendMessage,
} from '../controllers/message';
import http, {Server as HttpServer} from 'http';
import {Express} from 'express';

// TODO: function or class !!
export const socketService = (app: Express) => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: `http://localhost:${process.env.PORT}`,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', socket => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('sendMessage', (data: {userId: string; body: string}) => {
      console.log('sendMessage', data);
      sendMessage(socket, data);
    });

    socket.on(
      'reply',
      (data: {messageId: string; threadId: string; replyBody: string}) => {
        associateMessageWithThread(socket, data);
      },
    );

    socket.on('modify', (data: {messageId: string; body: string}) => {
      onEditMessage(socket, data);
    });

    socket.on('delete', (data: {messageId: string}) => {
      onDeleteMessage(socket, data);
    });

    socket.emit('getMessages', getMessages(socket));

    socket.on('disconnect', () => {
      console.log('User Disconnected', socket.id);
    });
  });

  server.listen(8001, () => {
    console.log('SERVER RUNNING');
  });
};

export class SocketService {
  private app: Express;
  private io: Server;
  private server: HttpServer;

  constructor(app: Express) {
    this.app = app;
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: `http://localhost:${process.env.PORT}`,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      },
    });

    this.initializeListeners();
  }

  private initializeListeners() {
    this.io.on('connection', socket => {
      console.log(`User Connected: ${socket.id}`);

      socket.on('sendMessage', (data: {userId: string; body: string}) => {
        console.log('sendMessage', data);
        sendMessage(socket, data);
      });

      socket.on(
        'reply',
        (data: {messageId: string; threadId: string; replyBody: string}) => {
          associateMessageWithThread(socket, data);
        },
      );

      socket.on('modify', (data: {messageId: string; body: string}) => {
        onEditMessage(socket, data);
      });

      socket.on('delete', (data: {messageId: string}) => {
        onDeleteMessage(socket, data);
      });

      socket.emit('getMessages', getMessages(socket));

      socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
      });
    });
  }

  public listen(port: number, callback?: () => void) {
    this.server.listen(port, callback);
  }
}
