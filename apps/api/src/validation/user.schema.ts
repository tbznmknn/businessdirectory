import { z } from 'zod';
import { UserRole } from '@businessdirectory/database';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(UserRole).optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    role: z.nativeEnum(UserRole).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>['body'];
export type UpdateUserDTO = z.infer<typeof updateUserSchema>['body'];
export type LoginDTO = z.infer<typeof loginSchema>['body'];
