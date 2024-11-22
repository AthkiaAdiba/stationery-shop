import express from 'express';
import { productControllers } from './product.controller';

const router = express.Router();

router.post('/api/products', productControllers.createProduct);
router.get('/api/products/:productId', productControllers.getSingleProduct);

export const routers = router;
