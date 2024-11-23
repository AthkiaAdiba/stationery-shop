import { Request, Response } from 'express';
import { orderServices } from './order.service';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    console.log(orderData.product);

    const product = await orderServices.getSingleProductFromDB(
      orderData?.product,
    );
    console.log(product);

    if (!product) {
      return res.status(400).json({
        message: 'Product not found',
        success: false,
      });
    }

    if (product.quantity < orderData.quantity) {
      return res.status(400).json({
        message: 'Insufficient stock available',
        success: false,
      });
    }

    product.quantity -= orderData.quantity;
    if (product.quantity === 0) {
      product.inStock = false;
    }

    await product.save();

    const result = await orderServices.createOrderIntoDB(orderData);

    return res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong!',
      success: false,
      error: error,
    });
  }
};

export const orderControllers = {
  createOrder,
};
