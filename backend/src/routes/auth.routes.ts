import { Router } from 'express';
import { login, callback } from '../controllers/auth.controller';

const router = Router();

router.get('/github', login);
router.get('/callback', callback);

export default router;
