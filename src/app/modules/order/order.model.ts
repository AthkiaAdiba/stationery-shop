import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

// This is my Order Schema
// const orderSchema = new Schema<IOrder>(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       required: [true, 'User Id is required!'],
//       ref: 'User',
//     },
//     product: {
//       type: Schema.Types.ObjectId,
//       required: [true, 'ProductId is Required!'],
//       ref: 'Product',
//     },
//     quantity: {
//       type: Number,
//       trim: true,
//       min: [1, 'Quantity should be at least 1!'],
//       required: [true, 'Quantity is required!'],
//       validate: {
//         validator: Number.isInteger,
//         message: (props) => `${props.value} is not an integer value.`,
//       },
//     },
//     totalPrice: {
//       type: Number,
//       trim: true,
//       required: [true, 'Total price is required!'],
//       min: [1, 'Total price should be a positive number!'],
//     },
//     status: {
//       type: String,
//       enum: ['Pending', 'Shipping'],
//       default: 'Pending',
//       trim: true,
//     },
//   },
//   { timestamps: true },
// );

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
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
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Shipped'],
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    shippingPhone: {
      type: String,
      trim: true,
    },
    shippingAddress: {
      type: String,
      trim: true,
    },
    productErrors: [
      {
        product: {
          type: String,
        },
        message: {
          type: String,
        },
      },
    ],
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<IOrder>('Order', orderSchema);
