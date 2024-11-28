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
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Something went wrong!',
      success: false,
      error: error,
      stack: null,
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string;

    const result = await productServices.getAllProductsFromDB(searchTerm);

    res.status(200).json({
      message: 'Products retrieved successfully',
      status: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Product is not found!',
      error: error,
      stack: null,
    });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await productServices.getSingleProductFromDB(productId);

    if (!result) {
      res.status(400).json({
        message: 'Product is not found!',
        status: false,
      });
    } else {
      res.status(200).json({
        message: 'Product retrieved successfully!',
        status: true,
        data: result,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Resource not found!',
      error: error,
      stack: null,
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!',
      error: error,
      stack: null,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    await productServices.deleteSingleProductFromDB(productId);

    res.status(200).json({
      message: 'Product deleted successfully',
      status: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!',
      error: error,
      stack: null,
    });
  }
};

export const productControllers = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
