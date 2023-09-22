import express from 'express';
import connectDB from './utils/connectdb';
import dotenv from 'dotenv';
import morgan from 'morgan';

import bodyParser from 'body-parser';

import {createUser, getAllUsers} from './controllers/user';
import cors from 'cors';

import {SocketService} from './services/socket';

const app = express();

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

// socket
const server = new SocketService(app);

server.listen(8001, () => {
  console.log('SERVER RUNNING');
});
