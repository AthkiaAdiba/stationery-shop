import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required!' }),
    title: z.string({ required_error: 'Product title is required!' }),
    brand: z.string({ required_error: 'Product brand is required!' }),
    author: z
      .string({ required_error: 'Product brand is required!' })
      .optional(),
    price: z.number({ required_error: 'Product brand is required!' }),
    image: z.string({ required_error: 'Product image is required!' }),
    category: z.enum([
      'pen',
      'notebook',
      'desk accessory',
      'markers & highlighter',
      'frame',
      'book',
    ]),
    description: z.string({
      required_error: 'Product description is required!',
    }),
    quantity: z.number({ required_error: 'Product quantity is required!' }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required!' }).optional(),
    title: z
      .string({ required_error: 'Product title is required!' })
      .optional(),
    brand: z
      .string({ required_error: 'Product brand is required!' })
      .optional(),
    price: z
      .number({ required_error: 'Product brand is required!' })
      .optional(),
    category: z
      .enum([
        'pen',
        'notebook',
        'desk accessory',
        'markers & highlighter',
        'frame',
        'book',
      ])
      .optional(),
    author: z.string().optional(),
    description: z
      .string({
        required_error: 'Product description is required!',
      })
      .optional(),
    quantity: z
      .number({ required_error: 'Product quantity is required!' })
      .optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
