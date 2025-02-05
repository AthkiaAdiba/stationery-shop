import express from 'express';
import { USER_ROLE } from '../auth/auth.constant';
import auth from '../../middlewares/auth';
import { UserControllers } from './users.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './users.validation';

const router = express.Router();

router.get(
  '/:userId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getSingleUser,
);

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUsers);

router.patch(
  '/:userId',
  auth(USER_ROLE.admin),
  UserControllers.updateUserStatus,
);

router.patch(
  '/:userId/user-data',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUserData,
);

export const UserRoutes = router;
