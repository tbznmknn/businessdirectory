import { User } from '@businessdirectory/database';
import { BaseService } from './base.service';
import { prisma } from '../utils/prisma';
import {
  PaginationParams,
  SortParams,
  FilterParams,
} from '../utils/pagination';
import { AppError } from '../utils/AppError';
import {
  CreateUserDTO,
  UpdateUserDTO,
  LoginDTO,
} from '../validation/user.schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService extends BaseService<
  User,
  CreateUserDTO,
  UpdateUserDTO
> {
  async findAll(
    pagination: PaginationParams,
    sort: SortParams,
    filter: FilterParams
  ): Promise<{ data: User[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip: pagination.skip,
        take: pagination.take,
        orderBy: sort.orderBy,
        where: filter.where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          hashedPassword: false, // Exclude password from results
          _count: {
            select: {
              reviews: true,
              admins: true,
            },
          },
        },
      }),
      prisma.user.count({ where: filter.where }),
    ]);

    return { data: data as User[], total };
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        hashedPassword: false,
        _count: {
          select: {
            reviews: true,
            admins: true,
          },
        },
      },
    }) as Promise<User | null>;
  }

  async create(data: CreateUserDTO): Promise<User> {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError(
        'User with this email already exists',
        400,
        'DUPLICATE_EMAIL'
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = data;

    const user = await prisma.user.create({
      data: {
        ...userData,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        hashedPassword: false,
      },
    });

    return user as User;
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Check for duplicate email
    if (data.email) {
      const duplicate = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new AppError(
          'User with this email already exists',
          400,
          'DUPLICATE_EMAIL'
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...data };

    // Hash password if provided
    if (data.password) {
      updateData.hashedPassword = await bcrypt.hash(data.password, 12);
      delete updateData.password;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        hashedPassword: false,
      },
    });

    return user as User;
  }

  async delete(id: number): Promise<void> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    await prisma.user.delete({ where: { id } });
  }

  async login(data: LoginDTO): Promise<{ user: User; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    if (!user.hashedPassword) {
      throw new AppError('Account has no password set', 400, 'NO_PASSWORD');
    }

    const isValid = await bcrypt.compare(data.password, user.hashedPassword);

    if (!isValid) {
      throw new AppError(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    const token = jwt.sign(
      {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      token,
    };
  }
}
