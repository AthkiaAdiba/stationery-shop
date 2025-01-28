import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TLoginUser, TUser } from './auth.interface';
import { User } from './auth.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
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

  if (user.status === 'inActive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'The user is inActive!');
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
    address: user?.address,
    phone: user?.phone,
    name: user?.name,
  };

  const accessToken = jwt.sign(
    {
      ...jwtPayload,
    },
    config.jwt_access_secret as string,
    { expiresIn: '5d' },
  );

  const refreshToken = jwt.sign(
    { ...jwtPayload },
    config.jwt_refresh_secret as string,
    { expiresIn: '365d' },
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  // check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  // console.log(decoded);

  const { userEmail } = decoded;

  //   checking if the user is exists
  const user = await User.isUserExists(userEmail);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
  }

  if (!user._id) {
    throw new AppError(StatusCodes.NOT_FOUND, 'The user _id is not found!');
  }

  if (user.status === 'inActive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'The user is inActive!');
  }

  const idString = user._id.toString();

  // create token and sent to the client
  const jwtPayload = {
    userId: idString,
    userEmail: user?.email,
    role: user?.role,
    address: user?.address,
    phone: user?.phone,
    name: user?.name,
  };

  const accessToken = jwt.sign(
    {
      ...jwtPayload,
    },
    config.jwt_access_secret as string,
    { expiresIn: '5d' },
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  registerUserIntoDB,
  loginUserIntoDB,
  refreshToken,
};
