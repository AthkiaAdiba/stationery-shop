import express from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.createProduct,
);
router.get('/:productId', ProductControllers.getSingleProduct);
router.get('/', ProductControllers.getAllProducts);
router.put(
  '/:productId',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidations.updateProductValidationSchema),
  ProductControllers.updateProduct,
);
router.delete(
  '/:productId',
  auth(USER_ROLE.admin),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
