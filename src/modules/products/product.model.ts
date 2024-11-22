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
      trim: true,
      min: [0, 'Price must be a positive number'],
      required: [true, 'Price is required!'],
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: [
          'writing',
          'office supplies',
          'art supplies',
          'educational',
          'technology',
        ],
        message: '{VALUE} is not valid category!',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [50, 'Description should be within 50 characters!'],
      required: [true, 'Description is required!'],
    },
    quantity: {
      type: Number,
      trim: true,
      default: 200,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true },
);

export const ProductModel = model<IProduct>('Product', productSchema);
