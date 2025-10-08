import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    businessId: z
      .number()
      .int()
      .positive('Business ID must be a positive integer'),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().optional(),
    richContent: z.string().optional(),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1)
      .max(5, 'Rating must be between 1 and 5')
      .optional(),
    comment: z.string().optional(),
    richContent: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export type CreateReviewDTO = z.infer<typeof createReviewSchema>['body'];
export type UpdateReviewDTO = z.infer<typeof updateReviewSchema>['body'];
