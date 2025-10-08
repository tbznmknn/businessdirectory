import { z } from 'zod';

export const createBusinessAddressSchema = z.object({
  body: z.object({
    businessId: z
      .number()
      .int()
      .positive('Business ID must be a positive integer'),
    address: z.string().min(1, 'Address is required'),
    latitude: z
      .number()
      .min(-90)
      .max(90, 'Latitude must be between -90 and 90'),
    longitude: z
      .number()
      .min(-180)
      .max(180, 'Longitude must be between -180 and 180'),
  }),
});

export const updateBusinessAddressSchema = z.object({
  body: z.object({
    businessId: z
      .number()
      .int()
      .positive('Business ID must be a positive integer')
      .optional(),
    address: z.string().min(1, 'Address is required').optional(),
    latitude: z
      .number()
      .min(-90)
      .max(90, 'Latitude must be between -90 and 90')
      .optional(),
    longitude: z
      .number()
      .min(-180)
      .max(180, 'Longitude must be between -180 and 180')
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export type CreateBusinessAddressDTO = z.infer<
  typeof createBusinessAddressSchema
>['body'];
export type UpdateBusinessAddressDTO = z.infer<
  typeof updateBusinessAddressSchema
>['body'];
