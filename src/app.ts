import express from 'express';
import connectDB from './utils/connectdb';
import dotenv from 'dotenv';
import morgan from 'morgan';

import bodyParser from 'body-parser';
import http from 'http';
import {Server} from 'socket.io';
import {createUser, getAllUsers} from './controllers/user';
import cors from 'cors';
import {associateMessageWithThread, sendMessage} from './controllers/message';

const app = express();

const server = http.createServer(app);

app.use(cors());

app.use(bodyParser.json());

connectDB();

dotenv.config();

app.use(morgan('tiny'));

app.post('/api/users', createUser);
app.get('/api/users', getAllUsers);

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.PORT}`,
  );
});

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

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(8001, () => {
  console.log('SERVER RUNNING');
});
