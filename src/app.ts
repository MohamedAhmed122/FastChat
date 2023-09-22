import express from 'express';
import connectDB from './utils/connectdb';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import {
  associateMessageWithThread,
  getMessages,
  sendMessage,
} from './controllers/message';
import {appRouter} from './routes';

const app = express();

const server = http.createServer(app);

app.use(cors());

app.use(bodyParser.json());

connectDB();

dotenv.config();

app.use(morgan('tiny'));

appRouter(app);

// TODO: Need to refactor, not sure how? I tried to move this code to separate file, but after that socket didn't connect.

const io = new Server(server, {
  cors: {
    origin: `http://localhost:${process.env.PORT}`,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

io.on('connection', socket => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('sendMessage', (data: {userId: string; body: string}) => {
    sendMessage(socket, data);
  });

  socket.on(
    'reply',
    (data: {messageId: string; threadId: string; replyBody: string}) => {
      associateMessageWithThread(socket, data);
    },
  );
  socket.on('getMessages', getMessages);

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(8001, () => {
  console.log('SERVER RUNNING');
});

// 6506ea9f901a85806d167031
