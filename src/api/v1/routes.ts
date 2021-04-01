import express from 'express';
import response from '../../utils/response';

const router = express.Router();

router.use('*', (_req, res) => res.json(response({ message: 'API v1 is deprecated.' })));

export default router;
