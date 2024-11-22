import { Request, Response } from 'express';
import { productServices } from './product.service';

const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const result = await productServices.createProductIntoDB(productData);

    res.status(200).json({
      success: true,
      message: 'Product created successfully!',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!',
      error: error,
    });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await productServices.getSingleProductFromDB(productId);

    res.status(200).json({
      message: 'Product retrieved successfully!',
      status: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Resource not found!',
      error: error,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const productData = req.body;

    const result = await productServices.updateProductInDB(
      productId,
      productData,
    );

    res.status(200).json({
      message: 'Product updated successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Resource not found!',
      error: error,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await productServices.deleteSingleProductFromDB(productId);

    res.status(200).json({
      message: 'Product deleted successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Resource not found!',
      error: error,
    });
  }
};

export const productControllers = {
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
