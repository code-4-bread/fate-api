import socketIO from 'socket.io';
import Session from '../models/Session';

const getSessionDetail = (sessionId) => (
  Session.findOne({
    _id: sessionId,
  })
);

export default ((server, events) => {
  const webSocket = socketIO(server, {
    origins: process.env.ORIGIN,
  });

  webSocket.on('connection', (socket) => {
    socket.on('getSessionDetail', async (data) => {
      const {
        sessionId,
      } = data;

      socket.join(sessionId);

      const result = await getSessionDetail(sessionId);

      socket.emit('sessionDetail', result);
    });

    socket.on('voteUpdate', (data) => {
      console.log(data);
    });

    events.on('newJoin', async (sessionId) => {
      const result = await getSessionDetail(sessionId);

      socket.to(sessionId).emit('sessionDetail', result);
    });
  });
});
