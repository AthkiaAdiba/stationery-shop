import { ProductModel } from '../products/product.model';
import { IOrder } from './order.interface';
import { OrderModel } from './order.model';

const createOrderIntoDB = async (orderData: IOrder) => {
  const result = await OrderModel.create(orderData);

  return result;
};

const getSingleProductFromDB = async (id: string) => {
  const product = await ProductModel.findOne({ _id: id });

  return product;
};

export const orderServices = {
  createOrderIntoDB,
  getSingleProductFromDB,
};
