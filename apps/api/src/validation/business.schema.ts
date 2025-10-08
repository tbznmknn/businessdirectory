import { z } from 'zod';

export const createBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    photo: z.string().url('Photo must be a valid URL'),
    link: z.string().url('Link must be a valid URL').optional(),
    summary: z.string().min(1, 'Summary is required'),
    richContent: z.string().min(1, 'Rich content is required'),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
    isInsideMall: z.boolean().optional(),
    categoryId: z
      .number()
      .int()
      .positive('Category ID must be a positive integer'),
  }),
});

export const updateBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    photo: z.string().url('Photo must be a valid URL').optional(),
    link: z.string().url('Link must be a valid URL').optional(),
    summary: z.string().min(1, 'Summary is required').optional(),
    richContent: z.string().min(1, 'Rich content is required').optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
    isInsideMall: z.boolean().optional(),
    categoryId: z
      .number()
      .int()
      .positive('Category ID must be a positive integer')
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export type CreateBusinessDTO = z.infer<typeof createBusinessSchema>['body'];
export type UpdateBusinessDTO = z.infer<typeof updateBusinessSchema>['body'];
