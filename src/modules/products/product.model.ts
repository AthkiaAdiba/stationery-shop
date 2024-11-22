import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Product name is required!'],
    },
    brand: {
      type: String,
      trim: true,
      required: [true, 'Product brand is required!'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required!'],
    },
    category: {
      type: String,
      trim: true,
      enum: [
        'writing',
        'office',
        'supplies',
        'art supplies',
        'educational',
        'technology',
      ],
      message: '{VALUE} is not valid category!',
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required!'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

export const ProductModel = model<IProduct>('Product', productSchema);
