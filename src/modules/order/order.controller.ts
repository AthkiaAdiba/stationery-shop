import { Request, Response } from 'express';
import { orderServices } from './order.service';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    const product = await orderServices.getSingleProductFromDB(
      orderData?.product,
    );

    let response: { status: number; body: any } | null = null;

    if (!product) {
      response = {
        status: 400,
        body: {
          message: 'Product not found',
          success: false,
        },
      };
    } else if (product.quantity < orderData.quantity) {
      response = {
        status: 400,
        body: {
          message: 'Insufficient stock available',
          success: false,
        },
      };
    } else {
      product.quantity -= orderData.quantity;
      if (product.quantity === 0) {
        product.inStock = false;
      }

      await product.save();

      const result = await orderServices.createOrderIntoDB(orderData);

      response = {
        status: 200,
        body: {
          success: true,
          message: 'Order created successfully!',
          data: result,
        },
      };
    }

    if (response) {
      res.status(response.status).json(response.body);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong!',
      success: false,
      error: error,
      stack: null,
    });
  }
};

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
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong!',
      success: false,
      error: error,
      stack: null,
    });
  }
};

export const orderControllers = {
  createOrder,
  calculateRevenue,
};
