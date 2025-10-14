import { Business } from '@businessdirectory/database';

export type BusinessWithExtras = Business & {
  category: { id: number; name: string };
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
