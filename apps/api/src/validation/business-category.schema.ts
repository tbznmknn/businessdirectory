import { z } from 'zod';

export const createBusinessCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
  }),
});

export const updateBusinessCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export type CreateBusinessCategoryDTO = z.infer<
  typeof createBusinessCategorySchema
>['body'];
export type UpdateBusinessCategoryDTO = z.infer<
  typeof updateBusinessCategorySchema
>['body'];
