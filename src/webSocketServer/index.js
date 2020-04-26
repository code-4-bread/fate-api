import socketIO from 'socket.io';
import Session from '../models/Session';

const getSessionDetail = (sessionId) => (
  Session.findOne({
    _id: sessionId,
  })
);

const updateVote = (data) => {
  const {
    sessionId,
    userId,
    vote,
  } = data;

  const voteObj = {
    voter: userId,
    votePoint: vote,
  };

  return Session.findByIdAndUpdate(sessionId, {
    $push: {
      votes: voteObj,
    },
  }, {
    lean: true,
  });
};

export default ((server, events) => {
  const webSocket = socketIO(server, {
    origins: process.env.ORIGIN,
  });

  webSocket.on('connection', (socket) => {
    socket.on('getSessionDetail', async (sessionId) => {
      socket.join(sessionId);

      const result = await getSessionDetail(sessionId);

      socket.emit('sessionDetail', result);
    });

    socket.on('setVote', async (data) => {
      await updateVote(data);

      const result = await getSessionDetail(data.sessionId);

      socket.to(data.sessionId).emit('sessionDetail', result);
    });

    socket.on('unsubscribe', (sessionId) => {
      socket.leave(sessionId);
    });

    events.on('broadcast', async (sessionId) => {
      const result = await getSessionDetail(sessionId);

      socket.to(sessionId).emit('sessionDetail', result);
    });
  });
});
