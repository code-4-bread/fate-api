import express from 'express';
import { ObjectId } from 'mongoose';
import statusCodes from '../utils/statusCodes';
import Session from '../models/Session';
import serverEvents from '../eventEmitter';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({}, {
      id: 1,
      name: 1,
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
    } = req.body;

    const newParticipant = {
      name: userName,
      userId,
      isOwner: false,
    };

    const session = await Session.findOneAndUpdate({
      _id: id,
    }, {
      $push: {
        participants: newParticipant,
      },
    });

    serverEvents.emit('newJoin', session.id);

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

export default router;
