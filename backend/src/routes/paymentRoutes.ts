import { Router } from 'express';
import { createOrder, verifyPayment, getMyHistory, consumePayment } from '../controllers/paymentController';
import { verifyAuth } from '../middleware/authMiddleware';

const router = Router();

// Protect all routes with Firebase Auth
router.use(verifyAuth);

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/history', getMyHistory);
router.post('/consume', consumePayment);

export default router;
