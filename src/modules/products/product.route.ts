import express from 'express';
import { productControllers } from './product.controller';

const router = express.Router();

router.post('/api/products', productControllers.createProduct);
router.get('/api/products/:productId', productControllers.getSingleProduct);
router.put('/api/products/:productId', productControllers.updateProduct);
router.delete('/api/products/:productId', productControllers.deleteProduct);

export const routers = router;
