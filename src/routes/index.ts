import userRouter from './users';
import messageRouter from './messages';
import {Express} from 'express';

export const appRouter = (app: Express) => {
  app.use('/api/users', userRouter);
  app.use('/api/messages', messageRouter);

  app.listen(process.env.PORT, () => {
    console.log(
      `[server]: Server is running at http://localhost:${process.env.PORT}`,
    );
  });
};
