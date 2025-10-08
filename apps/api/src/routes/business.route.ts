import { BaseRoute } from './base.route';
import { Business } from '@businessdirectory/database';
import { BusinessController } from '../controllers/business.controller';
import {
  CreateBusinessDTO,
  UpdateBusinessDTO,
  createBusinessSchema,
  updateBusinessSchema,
} from '../validation/business.schema';

class BusinessRoute extends BaseRoute<
  Business,
  CreateBusinessDTO,
  UpdateBusinessDTO
> {
  constructor() {
    super(new BusinessController(), createBusinessSchema, updateBusinessSchema);
  }
}

export default new BusinessRoute().router;
