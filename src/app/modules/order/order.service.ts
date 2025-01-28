/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../auth/auth.model';
import { ProductModel } from '../products/product.model';
import { IOrder } from './order.interface';
import { OrderModel } from './order.model';
import mongoose from 'mongoose';
import { orderUtils } from './order.utils';

const createOrderIntoDB = async (
  userId: string,
  orderData: IOrder,
  client_ip: string,
) => {
  const session = await mongoose.startSession();

  if (!orderData?.products?.length)
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Order is not specified');

  const userExists = await User.findById(userId).session(session);

  if (!userExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Please create your account!');
  }

  if (userExists.status === 'inActive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'The user is inActive!');
  }

  const productsArray = orderData.products;
  // console.log(productsArray);

  let totalPrice = 0;
  const productErrors: any = []; // Array to collect product-specific errors

  try {
    session.startTransaction();

    const singleProduct = await Promise.all(
      productsArray.map(async (item) => {
        try {
          const product = await ProductModel.findById(item.product).session(
            session,
          );

          if (!product) {
            throw new AppError(
              StatusCodes.NOT_FOUND,
              'This product is not available!',
            );
          }

          // product quantity check
          if (product.quantity === 0) {
            throw new AppError(
              StatusCodes.NOT_FOUND,
              `${product.name} is out of stock!`,
            );
          }

          if (item.quantity > product.quantity) {
            throw new AppError(
              StatusCodes.BAD_REQUEST,
              `${item.quantity} products is not available. Please reduce your quantity!`,
            );
          }

          if (!product.inStock) {
            throw new AppError(
              StatusCodes.NOT_FOUND,
              'This product is out of stock!',
            );
          }

          const reducedProductQuantity = product.quantity - item.quantity;

          const updatedProductQuantity = await ProductModel.findByIdAndUpdate(
            item.product,
            { quantity: reducedProductQuantity },
            {
              new: true,
              session,
            },
          );

          if (!updatedProductQuantity) {
            throw new AppError(
              StatusCodes.BAD_REQUEST,
              'Product Quantity is not updated!',
            );
          }

          if (updatedProductQuantity.quantity === 0) {
            await ProductModel.findByIdAndUpdate(
              item.product,
              { inStock: false },
              {
                new: true,
                session,
              },
            );
          }

          // Calculate the subtotal for the current item
          const subtotal = product ? (product.price || 0) * item.quantity : 0;

          return {
            ...item,
            subtotal,
            success: true,
          };
        } catch (error: any) {
          // Collect the error details
          productErrors.push({
            product: item.product,
            message: error.message,
          });
          return {
            ...item,
            subtotal: 0, // Ignore the subtotal for failed products
            success: false,
            error: error.message,
          };
        }
      }),
    );

    // Calculate the total price from the resolved values, skipping failed products
    totalPrice = singleProduct
      .filter((product) => product.success) // Only include successful products
      .reduce((acc, curr) => acc + curr.subtotal, 0);

    // console.log(totalPrice);
    // console.log(singleProduct);
    // console.log(orderData);
    // console.log(productErrors);

    const order = {
      user: userId,
      products: singleProduct,
      address: orderData.address,
      totalPrice,
      productErrors: productErrors,
    };

    const result = await OrderModel.create([order], { session });

    // Payment integration logic
    const shurjopayPayload = {
      amount: totalPrice,
      order_id: result[0]._id,
      currency: 'BDT',
      customer_name: userExists.name,
      customer_address: userExists.address,
      customer_email: userExists.email,
      customer_phone: userExists.phone,
      customer_city: userExists.address,
      client_ip, // Update with real client IP
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus) {
      const addedPaymentFieldsOrderData = await OrderModel.findOneAndUpdate(
        { _id: result[0]._id },
        {
          transaction: {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!addedPaymentFieldsOrderData) {
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to update the order!',
        );
      }

      result[0] = addedPaymentFieldsOrderData;
    }

    await session.commitTransaction();
    await session.endSession();

    // return payment.checkout_url;
    return { result, payment };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await OrderModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  return verifiedPayment;
};

const getMyOrdersFromDB = async (userId: string) => {
  const userExists = await User.findById(userId);

  if (!userExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found!');
  }

  if (userExists?.status === 'inActive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'The user is inActive!');
  }

  const result = await OrderModel.find({ user: userExists._id });

  return result;
};

const getAllOrders = async () => {
  const result = await OrderModel.find();

  return result;
};

const updateOrderStatusIntoDB = async (id: string) => {
  const order = await OrderModel.findById(id);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This Order is not available!!');
  }

  const result = await OrderModel.findByIdAndUpdate(
    id,
    { orderStatus: 'Shipping' },
    { new: true },
  );

  return result;
};

const deleteSingleOrderFromDB = async (id: string) => {
  const order = await OrderModel.findById(id);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This Order is not available!!');
  }

  const result = await OrderModel.findByIdAndDelete(id);

  return result;
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
  verifyPayment,
  calculateRevenueFromDB,
  getMyOrdersFromDB,
  getAllOrders,
  deleteSingleOrderFromDB,
  updateOrderStatusIntoDB,
};

// const session = await mongoose.startSession();

// const user = await User.findById(userId).session(session);

// if (!user) {
//   throw new AppError(StatusCodes.NOT_FOUND, 'Please create your account!');
// }

// const product = await ProductModel.findById(orderData.product).session(
//   session,
// );

// if (!product) {
//   throw new AppError(StatusCodes.NOT_FOUND, 'This product is not available!');
// }

// if (product.quantity === 0) {
//   throw new AppError(
//     StatusCodes.NOT_FOUND,
//     `${product.name} is out of stock!`,
//   );
// }

// if (orderData.quantity > product.quantity) {
//   throw new AppError(
//     StatusCodes.BAD_REQUEST,
//     `${orderData.quantity} products is not available. Please reduce your quantity!`,
//   );
// }

// if (!product.inStock) {
//   throw new AppError(StatusCodes.NOT_FOUND, 'This product is out of stock!');
// }

// try {
//   session.startTransaction();

//   const reducedProductQuantity = product.quantity - orderData.quantity;

//   const updatedProductQuantity = await ProductModel.findByIdAndUpdate(
//     orderData.product,
//     { quantity: reducedProductQuantity },
//     {
//       new: true,
//       session,
//     },
//   );

//   if (!updatedProductQuantity) {
//     throw new AppError(
//       StatusCodes.BAD_REQUEST,
//       'Product Quantity is not updated!',
//     );
//   }

//   if (updatedProductQuantity.quantity === 0) {
//     await ProductModel.findByIdAndUpdate(
//       orderData.product,
//       { inStock: false },
//       {
//         new: true,
//         session,
//       },
//     );
//   }

//   const result = await OrderModel.create([orderData], { session });

//   await session.commitTransaction();
//   await session.endSession();

//   return result;
// } catch (err) {
//   await session.abortTransaction();
//   await session.endSession();
//   throw err;
// }
