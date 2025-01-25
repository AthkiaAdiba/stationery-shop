import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { StatusCodes } from 'http-status-codes';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDB(req.body);
  const { token } = result;

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Login successful',
    data: {
      token,
    },
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
};
