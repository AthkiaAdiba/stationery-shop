import { IProduct } from './product.interface';
import { ProductModel } from './product.model';

const createProductIntoDB = async (productData: IProduct) => {
  const result = await ProductModel.create(productData);

  return result;
};

const getAllProductsFromDB = async (searchWord: string) => {
  const result = await ProductModel.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: searchWord, $options: 'i' } },
          { brand: { $regex: searchWord, $options: 'i' } },
          { category: { $regex: searchWord, $options: 'i' } },
        ],
      },
    },
  ]);

  return result;
};

const getSingleProductFromDB = async (id: string) => {
  const result = await ProductModel.findById(id);

  return result;
};

const updateProductInDB = async (
  id: string,
  productData: Partial<IProduct>,
) => {
  const result = await ProductModel.findByIdAndUpdate(id, productData, {
    new: true,
  });

  return result;
};

const deleteSingleProductFromDB = async (id: string) => {
  const result = await ProductModel.findByIdAndDelete(id, {
    new: true,
  });

  return result;
};

export const productServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteSingleProductFromDB,
  updateProductInDB,
};
