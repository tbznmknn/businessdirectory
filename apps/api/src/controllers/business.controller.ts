import { Request } from 'express';
import { Business } from '@businessdirectory/database';
import { BaseController } from './base.controller';
import { BusinessService } from '../services/business.service';
import {
  CreateBusinessDTO,
  UpdateBusinessDTO,
} from '../validation/business.schema';
import { QueryBuilder } from '../utils/pagination';

export class BusinessController extends BaseController<
  Business,
  CreateBusinessDTO,
  UpdateBusinessDTO
> {
  constructor() {
    super(new BusinessService(), 'Business');
  }

  protected override getFilterParams(req: Request) {
    const filters = QueryBuilder.getFilters(req, [
      'name',
      'email',
      'categoryId',
      'isActive',
      'isInsideMall',
    ]);
    const search = QueryBuilder.getSearch(req, [
      'name',
      'summary',
      'description',
    ]);

    return {
      where: {
        ...filters.where,
        ...search.where,
      },
    };
  }
}
