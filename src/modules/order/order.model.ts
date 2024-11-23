import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is Required!'],
      unique: true,
    },
    product: {
      type: String,
      required: [true, 'ProductId is Required!'],
      trim: true,
    },
    quantity: {
      type: Number,
      trim: true,
      min: [0, 'Quantity should be a positive number!'],
      required: [true, 'Quantity is required!'],
    },
    totalPrice: {
      type: Number,
      trim: true,
      validate: {
        validator: Number.isInteger,
        message: (props) => `${props.value} is not an integer value.`,
      },
    },
  },
  { timestamps: true },
);

export const OrderModel = model<IOrder>('Order', orderSchema);
