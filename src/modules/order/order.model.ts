import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is Required!'],
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
        },
        message: '{VALUE} is not a valid email',
      },
    },
    product: {
      type: String,
      required: [true, 'ProductId is Required!'],
      trim: true,
    },
    quantity: {
      type: Number,
      trim: true,
      min: [1, 'Quantity should be at least 1!'],
      required: [true, 'Quantity is required!'],
      validate: {
        validator: Number.isInteger,
        message: (props) => `${props.value} is not an integer value.`,
      },
    },
    totalPrice: {
      type: Number,
      trim: true,
      required: [true, 'Total price is required!'],
      min: [1, 'Total price should be a positive number!'],
    },
  },
  { timestamps: true },
);

export const OrderModel = model<IOrder>('Order', orderSchema);
