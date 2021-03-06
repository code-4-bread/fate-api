import express from 'express';
import statusCodes from '../utils/statusCodes';
import Session from '../models/Session';
import serverEvents from '../eventEmitter';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({}, {
      id: 1,
      title: 1,
    });

    return res.status(statusCodes.OK).send({
      data: sessions,
    });
  } catch (e) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      {
        message: e.message,
      },
    );
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      owner: sessionOwnerId,
      name: title,
    } = req.body;

    const participants = [
      {
        name: 'Owner',
        userId: sessionOwnerId,
        isOwner: true,
      },
    ];

    const session = await Session.create({
      title,
      sessionOwnerId,
      participants,
      state: 'pending',
    });

    return res.status(statusCodes.OK).send(
      {
        id: session.id,
      },
    );
  } catch (e) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      {
        message: e.message,
      },
    );
  }
});

router.post('/:id', async (req, res) => {
  try {
    const {
      id,
    } = req.params;

    const {
      userId,
      userName,
      action,
    } = req.body;

    if (action === 'newJoin') {
      const existSession = await Session.findOne({
        _id: id,
      });

      if (existSession.state !== 'pending') {
        return res.status(statusCodes.BAD_REQUEST).send(
          {
            message: `Section has already ${existSession.state}`,
          },
        );
      }

      const newParticipant = {
        name: userName,
        userId,
        isOwner: false,
      };

      await Session.updateOne({
        _id: id,
      }, {
        $push: {
          participants: newParticipant,
        },
      });

      serverEvents.emit('broadcast', id);

      return res.status(statusCodes.OK).send(
        {
          id,
        },
      );
    }

    if (action === 'sessionRestart') {
      await Session.findOneAndUpdate({
        _id: id,
      }, {
        $set: {
          state: 'pending',
          votes: [],
        },
      });

      serverEvents.emit('broadcast', id);

      return res.status(statusCodes.OK).send();
    }

    if (action === 'sessionCalculate') {
      await Session.findOneAndUpdate({
        _id: id,
      }, {
        $set: {
          state: 'calculated',
        },
      });

      serverEvents.emit('broadcast', id);

      return res.status(statusCodes.OK).send();
    }

    if (action === 'sessionEnd') {
      await Session.findOneAndUpdate({
        _id: id,
      }, {
        $set: {
          state: 'ended',
        },
      });

      serverEvents.emit('broadcast', id);

      return res.status(statusCodes.OK).send();
    }

    return res.status(statusCodes.BAD_REQUEST).send({
      message: 'invalid action',
    });
  } catch (e) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      {
        message: e.message,
      },
    );
  }
});

export default router;
