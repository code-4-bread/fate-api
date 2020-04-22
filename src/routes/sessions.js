import express from 'express';
import statusCodes from '../utils/statusCodes';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.status(statusCodes.OK).send({
      message: 'Router Get',
    });
  } catch (e) {
    res.status(statusCodes).send(
      {
        message: e.message,
      },
    );
  }
});

router.post('/', (req, res) => {
  try {
    res.send('');
  } catch (e) {
    res.status(statusCodes).send(
      {
        message: e.message,
      },
    );
  }
});

export default router;
