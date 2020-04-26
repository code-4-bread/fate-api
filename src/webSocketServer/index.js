import socketIO from 'socket.io';
import Session from '../models/Session';

export default ((server, events) => {
  const webSocket = socketIO(server, {
    origins: process.env.ORIGIN,
  });

  webSocket.on('connection', (socket) => {
    socket.on('getSessionDetail', async (data) => {
      const {
        sessionId,
      } = data;

      const result = await Session.findOne({
        _id: sessionId,
      });

      socket.emit('sessionDetail', result);
    });

    socket.on('voteUpdate', (data) => {
      console.log(data);
    });

    // events.on('update', () => {
    //   socket.broadcast.emit('Hello');
    // });
  });
});
