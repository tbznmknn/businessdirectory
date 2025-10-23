import {
  Business,
  BusinessCategory,
  BusinessParentCategory,
  Reviews,
} from '@businessdirectory/database';

export type BusinessWithExtras = Business & {
  category: {
    id: number;
    name: string;
    icon: string;
    parentCategory: { id: number; icon: string; name: string };
  };
  addresses: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    businessId: number;
    address: string;
    latitude: number;
    longitude: number;
  }[];
  _count: {
    reviews: number;
    admins: number;
  };
  averageReviewRating: number | null;
};
export type BusinessCategoryListResponse = BusinessCategory & {
  _count: { businesses: number };
  parentCategory: { id: number; icon: string; name: string };
};
export type ReviewsListResponse = Reviews & {
  user: { id: number; firstName: string; lastName: string };
  business: { id: number; name: string; photo: string };
};
export type BusinessParentCategoryListResponse = BusinessParentCategory & {
  _count: { categories: number };
  categories: BusinessCategory[];
};
