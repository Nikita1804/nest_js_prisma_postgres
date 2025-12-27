import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'src/generated/prisma/client/client';
import { CreateSubscriptionDto } from './subscription.dto';
import { UsersService } from '../users/users.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UsersService,
    private readonly productService: ProductService,
  ) {}

  async findAll() {
    return this.databaseService.subscription.findMany();
  }

  async create(createSubDto: CreateSubscriptionDto) {
    const { userId, productId } = createSubDto;
    await this.userService.findOne(userId);
    const product: Prisma.ProductModel =
      await this.productService.findOne(productId);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    return this.databaseService.subscription.create({
      data: {
        userId: userId,
        productId: productId,
        monthlyTokens: product.token_count,
        status: 'ACTIVE',
        endDate: endDate,
      },
    });
  }
}
