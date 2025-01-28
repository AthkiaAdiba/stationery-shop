import { Request, Response } from 'express';
import { orderServices } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createOrder = catchAsync(async (req, res) => {
  const user = req?.user?.userId;
  const result = await orderServices.createOrderIntoDB(user, req.body, req.ip!);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const result = await orderServices.verifyPayment(
    req.query.order_id as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order verified successfully!',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await orderServices.getMyOrdersFromDB(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My Orders got successfully!',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrders();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders got successfully!',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const result = await orderServices.updateOrderStatusIntoDB(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order is updated successfully!',
    data: result,
  });
});

const deleteSingleOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const result = await orderServices.deleteSingleOrderFromDB(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order is deleted successfully!',
    data: result,
  });
});

const calculateRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await orderServices.calculateRevenueFromDB();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      success: true,
      data: {
        totalRevenue,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Something went wrong!',
      success: false,
      error: error,
      stack: null,
    });
  }
};

export const OrderControllers = {
  createOrder,
  verifyPayment,
  calculateRevenue,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteSingleOrder,
};
