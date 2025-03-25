// routes/productRoutes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Protected Routes
router.post('/createproduct', isAuth, isAdmin, createProduct);
router.put('/:id', isAuth, isAdmin, updateProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);

export default router;