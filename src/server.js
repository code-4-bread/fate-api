import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const server = express();
const port = process.env.SERVER_PORT;


server.use(routes);


server.listen(port, () => {
  console.log(`Fate API Server is running on port ${port}`);
});
