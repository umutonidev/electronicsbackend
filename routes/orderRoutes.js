// routes/orderRoutes.js
import express from 'express';
import {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    getOrderHistory,
    getAllOrders,
    deleteOrder,
    deliverOrder
} from '../controllers/orderController.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/', isAuth, createOrder);
router.get('/:id', isAuth, getOrderById);
router.put('/:id/pay', isAuth, updateOrderToPaid);
router.get('/history', isAuth, getOrderHistory);

// Admin Routes
router.get('/', isAuth, isAdmin, getAllOrders);
router.delete('/:id', isAuth, isAdmin, deleteOrder);
router.put('/:id/deliver', isAuth, isAdmin, deliverOrder);

export default router;