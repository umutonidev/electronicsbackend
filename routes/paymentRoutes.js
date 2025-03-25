// routes/paymentRoutes.js
import express from 'express';
import { getPaymentKeys } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/keys', getPaymentKeys);

export default router;