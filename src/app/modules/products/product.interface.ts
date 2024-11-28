import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand: string;
  price: number;
  category:
    | 'writing'
    | 'office'
    | 'supplies'
    | 'art supplies'
    | 'educational'
    | 'technology';
  description: string;
  quantity: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}
