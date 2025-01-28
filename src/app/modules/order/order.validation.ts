import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product Id is required!' }),
    quantity: z.number({ required_error: 'Quantity is required!' }),
    totalPrice: z.number({ required_error: 'Total Price is required!' }),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
};
