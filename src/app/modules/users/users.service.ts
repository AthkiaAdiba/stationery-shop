import { TUser } from '../auth/auth.interface';
import { User } from '../auth/auth.model';

const getAllUsersFromDB = async () => {
  const result = await User.find();

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);

  return result;
};

const updateUserDataIntoDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const updateUserStatusInDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { status: 'deactivated' },
    {
      new: true,
    },
  );

  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserStatusInDB,
  updateUserDataIntoDB,
};
