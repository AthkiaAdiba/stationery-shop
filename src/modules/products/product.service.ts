import { IProduct } from './product.interface';
import { ProductModel } from './product.model';

const createProductIntoDB = async (productData: IProduct) => {
  const result = await ProductModel.create(productData);

  return result;
};

const getSingleProductFromDB = async (id: string) => {
  const result = ProductModel.findById(id);

  return result;
};

export const productServices = {
  createProductIntoDB,
  getSingleProductFromDB,
};
