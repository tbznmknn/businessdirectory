import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','firstName','lastName','phone','hashedPassword','role','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['id','email','token','expires','createdAt','action']);

export const BusinessCategoryScalarFieldEnumSchema = z.enum(['id','name','description','createdAt','updatedAt']);

export const BusinessScalarFieldEnumSchema = z.enum(['id','name','email','photo','link','summary','richContent','isActive','isInsideMall','description','createdAt','updatedAt','categoryId']);

export const BusinessAddressScalarFieldEnumSchema = z.enum(['id','businessId','address','latitude','longitude','createdAt','updatedAt']);

export const BusinessAdminScalarFieldEnumSchema = z.enum(['id','businessId','userId','createdAt','updatedAt']);

export const ReviewsScalarFieldEnumSchema = z.enum(['id','businessId','userId','rating','comment','createdAt','updatedAt']);

export const RichReviewContentScalarFieldEnumSchema = z.enum(['id','content','createdAt','updatedAt','reviewId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['email','firstName','lastName','phone','hashedPassword']);

export const VerificationTokenOrderByRelevanceFieldEnumSchema = z.enum(['email','token']);

export const BusinessCategoryOrderByRelevanceFieldEnumSchema = z.enum(['name','description']);

export const BusinessOrderByRelevanceFieldEnumSchema = z.enum(['name','email','photo','link','summary','richContent','description']);

export const BusinessAddressOrderByRelevanceFieldEnumSchema = z.enum(['address']);

export const ReviewsOrderByRelevanceFieldEnumSchema = z.enum(['comment']);

export const RichReviewContentOrderByRelevanceFieldEnumSchema = z.enum(['content']);

export const UserRoleSchema = z.enum(['USER','ADMIN','SUPERADMIN']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const VerificationTokenActionSchema = z.enum(['VERIFY','RESET']);

export type VerificationTokenActionType = `${z.infer<typeof VerificationTokenActionSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  id: z.number().int(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  hashedPassword: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  action: VerificationTokenActionSchema,
  id: z.number().int(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// BUSINESS CATEGORY SCHEMA
/////////////////////////////////////////

export const BusinessCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type BusinessCategory = z.infer<typeof BusinessCategorySchema>

/////////////////////////////////////////
// BUSINESS SCHEMA
/////////////////////////////////////////

export const BusinessSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  photo: z.string(),
  link: z.string().nullable(),
  summary: z.string(),
  richContent: z.string(),
  isActive: z.boolean(),
  isInsideMall: z.boolean(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  categoryId: z.number().int(),
})

export type Business = z.infer<typeof BusinessSchema>

/////////////////////////////////////////
// BUSINESS ADDRESS SCHEMA
/////////////////////////////////////////

export const BusinessAddressSchema = z.object({
  id: z.number().int(),
  businessId: z.number().int(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type BusinessAddress = z.infer<typeof BusinessAddressSchema>

/////////////////////////////////////////
// BUSINESS ADMIN SCHEMA
/////////////////////////////////////////

export const BusinessAdminSchema = z.object({
  id: z.number().int(),
  businessId: z.number().int(),
  userId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type BusinessAdmin = z.infer<typeof BusinessAdminSchema>

/////////////////////////////////////////
// REVIEWS SCHEMA
/////////////////////////////////////////

export const ReviewsSchema = z.object({
  id: z.number().int(),
  businessId: z.number().int(),
  userId: z.number().int(),
  rating: z.number().int(),
  comment: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Reviews = z.infer<typeof ReviewsSchema>

/////////////////////////////////////////
// RICH REVIEW CONTENT SCHEMA
/////////////////////////////////////////

export const RichReviewContentSchema = z.object({
  id: z.number().int(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  reviewId: z.number().int(),
})

export type RichReviewContent = z.infer<typeof RichReviewContentSchema>
