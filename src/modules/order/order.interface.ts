import { Document } from 'mongoose';

export interface IOrder extends Document {
  email: string;
  product: string;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
