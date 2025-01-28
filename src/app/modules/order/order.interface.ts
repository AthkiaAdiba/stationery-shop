import { Types } from 'mongoose';

// export type IOrder = {
//   user: Types.ObjectId;
//   product: Types.ObjectId;
//   quantity: number;
//   totalPrice: number;
//   status: 'Pending' | 'Shipping';
// };

export type IOrder = {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  orderStatus: 'Pending' | 'Shipped';
  status: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled';
  address?: string;
  productErrors?: {
    product: string;
    message: string;
  }[];
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};
