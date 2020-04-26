import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import mongoManager from './mongoManager';
import logger from './logger';
import webSocket from './webSocketServer';
import serverEvents from './eventEmitter';

dotenv.config();

const server = express();

const port = process.env.SERVER_PORT;

mongoManager.connect()
  .then(() => {
    logger.info('Database connected successfully.');
  })
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });


server.use(bodyParser.json({ type: 'application/json' }));
server.use(cors({
  credentials: true,
  origin: process.env.ORIGIN,
}));

server.use(routes);

const webServer = server.listen(port, () => {
  logger.info(`Fate API Server is running on port ${port}`);
});

webSocket(webServer, serverEvents);
