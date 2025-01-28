import { productServices } from './product.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createProduct = catchAsync(async (req, res) => {
  const productData = req.body;

  const result = await productServices.createProductIntoDB(productData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await productServices.getAllProductsFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products are retrieved successfully!',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const result = await productServices.getSingleProductFromDB(productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product is retrieved successfully!',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const productData = req.body;

  const result = await productServices.updateProductInDB(
    productId,
    productData,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product is updated successfully!',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  await productServices.deleteSingleProductFromDB(productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product is deleted successfully!',
    data: {},
  });
});

export const ProductControllers = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
