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

const calculateRevenueFromDB = async () => {
  const result = await OrderModel.aggregate([
    {
      $addFields: {
        productId: { $toObjectId: '$product' },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $project: {
        revenue: {
          $multiply: ['$productDetails.price', '$quantity'],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$revenue' },
      },
    },
  ]);

  const totalRevenue = result[0]?.totalRevenue || 0;

  return totalRevenue;
};

export const orderServices = {
  createOrderIntoDB,
  getSingleProductFromDB,
  calculateRevenueFromDB,
};
