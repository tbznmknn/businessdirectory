import { Business, BusinessWithExtras } from '@businessdirectory/database';
import { BaseService } from './base.service';
import { prisma } from '../utils/prisma';
import {
  PaginationParams,
  SortParams,
  FilterParams,
} from '../utils/pagination';
import { AppError } from '../utils/AppError';
import {
  CreateBusinessDTO,
  UpdateBusinessDTO,
} from '../validation/business.schema';

export class BusinessService extends BaseService<
  Business,
  CreateBusinessDTO,
  UpdateBusinessDTO
> {
  async findAll(
    pagination: PaginationParams,
    sort: SortParams,
    filter: FilterParams
  ): Promise<{ data: BusinessWithExtras[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.business.findMany({
        skip: pagination.skip,
        take: pagination.take,
        orderBy: sort.orderBy,
        where: filter.where,
        include: {
          reviews: {
            select: {
              rating: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          addresses: true,
          _count: {
            select: {
              reviews: true,
              admins: true,
            },
          },
        },
      }),
      prisma.business.count({ where: filter.where }),
    ]);
    // find average review rating

    const dataWithAverage = data.map((business) => {
      const avg =
        business.reviews.length > 0
          ? business.reviews.reduce((sum, r) => sum + r.rating, 0) /
            business.reviews.length
          : null;

      return { ...business, averageReviewRating: avg };
    });

    return { data: dataWithAverage as BusinessWithExtras[], total };
  }

  async findById(id: number): Promise<Business | null> {
    return prisma.business.findUnique({
      where: { id },
      include: {
        category: true,
        addresses: true,
        admins: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            richContent: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            admins: true,
          },
        },
      },
    });
  }

  async create(data: CreateBusinessDTO): Promise<Business> {
    // Verify category exists
    const category = await prisma.businessCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError(
        'Business category not found',
        404,
        'CATEGORY_NOT_FOUND'
      );
    }

    return prisma.business.create({
      data,
      include: {
        category: true,
        addresses: true,
      },
    });
  }

  async update(id: number, data: UpdateBusinessDTO): Promise<Business> {
    const existing = await prisma.business.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Business not found', 404, 'NOT_FOUND');
    }

    // Verify category exists if provided
    if (data.categoryId) {
      const category = await prisma.businessCategory.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new AppError(
          'Business category not found',
          404,
          'CATEGORY_NOT_FOUND'
        );
      }
    }

    return prisma.business.update({
      where: { id },
      data,
      include: {
        category: true,
        addresses: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    const existing = await prisma.business.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Business not found', 404, 'NOT_FOUND');
    }

    await prisma.business.delete({ where: { id } });
  }
}
