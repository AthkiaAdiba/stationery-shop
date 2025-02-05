import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { UserServices } from './users.service';

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All users are retrieved successfully!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  //   const { userId } = req.params;
  const userId = req.user.userId;

  const result = await UserServices.getSingleUserFromDB(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User is retrieved successfully!',
    data: result,
  });
});

const updateUserData = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;

  const result = await UserServices.updateUserDataIntoDB(userId, userData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Information is updated successfully!',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await UserServices.updateUserStatusInDB(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User status is updated successfully!',
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
  getSingleUser,
  updateUserData,
  updateUserStatus,
};
