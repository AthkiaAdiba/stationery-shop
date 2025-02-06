import { Types } from 'mongoose';

export type IOrder = {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  orderStatus: 'Pending' | 'Shipped';
  status: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled';
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  shippingPhone?: string;
  shippingAddress?: string;
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
