import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TLoginUser, TUser } from './auth.interface';
import { User } from './auth.model';
import jwt from 'jsonwebtoken';
import config from '../../config';

const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);

  return result;
};

const loginUserIntoDB = async (payload: TLoginUser) => {
  //   checking if the user is exists
  const user = await User.isUserExists(payload?.email);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
  }

  if (!user._id) {
    throw new AppError(StatusCodes.NOT_FOUND, 'The user _id is not found!');
  }

  const idString = user._id.toString();
  // console.log(idString);

  // // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Password does not match!');
  }

  // create token and sent to the client
  const jwtPayload = {
    userId: idString,
    userEmail: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(
    {
      jwtPayload,
    },
    config.jwt_access_secret as string,
    { expiresIn: '5d' },
  );

  return {
    token,
  };
};

export const AuthServices = {
  registerUserIntoDB,
  loginUserIntoDB,
};
