import express, {Request, Response} from 'express';
import connectDB from './utils/connectdb';
import dotenv from 'dotenv';
import morgan from 'morgan';

const app = express();

connectDB();

dotenv.config();

app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.PORT}`,
  );
});
