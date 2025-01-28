import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Product name is required!'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Product title is required!'],
    },
    brand: {
      type: String,
      trim: true,
      required: [true, 'Product brand is required!'],
    },
    author: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
      min: [0, 'Price must be a positive number'],
      required: [true, 'Product price is required!'],
    },
    image: {
      type: String,
      trim: true,
      required: [true, 'Product image is required!'],
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: [
          'pens',
          'notebooks',
          'desk accessories',
          'markers & highlighters',
          'frames',
          'books',
        ],
        message: '{VALUE} is not valid category!',
      },
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required!'],
    },
    quantity: {
      type: Number,
      trim: true,
      default: 200,
      required: [true, 'Product quantity is required!'],
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
