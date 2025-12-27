import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'src/generated/prisma/client/client';
import { DISPLAY_NAMES } from './service';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(id: number): Promise<any> {
    return this.databaseService.product
      .findFirst({
        where: {
          id,
        },
      })
      .then((product) => {
        if (!product) {
          throw new NotFoundException(`product with id ${id} not found`);
        }
        return product;
      });
  }

  async create(createProductDto: Prisma.ProductCreateInput) {
    return this.databaseService.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    const products = await this.databaseService.product.findMany({
      where: { is_active: true },
    });
    return products.map((product) => ({
      ...product,
      displayName: DISPLAY_NAMES[product.name] || product.name,
      name: DISPLAY_NAMES[product.name] || product.name,
    }));
  }
}
