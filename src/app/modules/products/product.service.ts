import QueryBuilder from '../../builder/QueryBuilder';
import { IProduct } from './product.interface';
import { ProductModel } from './product.model';

const createProductIntoDB = async (payload: IProduct) => {
  const result = await ProductModel.create(payload);

  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productSearchableFields = [
    'name',
    'title',
    'brand',
    'category',
    'description',
  ];

  const productQuery = new QueryBuilder(ProductModel.find(), query)
    .search(productSearchableFields)
    .filter()
    .priceFilter();

  const result = await productQuery.modelQuery;

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
