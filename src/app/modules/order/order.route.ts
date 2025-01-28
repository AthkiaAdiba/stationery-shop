import express from 'express';
import { OrderControllers } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  // validateRequest(OrderValidations.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get('/verify', auth(USER_ROLE.user), OrderControllers.verifyPayment);

router.get('/my-orders', auth(USER_ROLE.user), OrderControllers.getMyOrders);

router.get('/', auth(USER_ROLE.admin), OrderControllers.getAllOrders);

router.delete(
  '/:orderId',
  auth(USER_ROLE.admin),
  OrderControllers.deleteSingleOrder,
);

router.patch(
  '/:orderId',
  auth(USER_ROLE.admin),
  OrderControllers.updateOrderStatus,
);

router.get('/revenue', OrderControllers.calculateRevenue);

export const OrderRoutes = router;
