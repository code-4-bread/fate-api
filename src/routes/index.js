import express from 'express';
import sessionRoutes from './sessions';

const router = express.Router();

router.use('/sessions', sessionRoutes);

export default router;
