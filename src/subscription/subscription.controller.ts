import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
// import { Prisma } from 'src/generated/prisma/client/client';
import { CreateSubscriptionDto } from './subscription.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Подписки')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('/all')
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Создание новой подписки',
    description: 'Создает новую подписку для пользователя на указанный продукт',
  })
  @ApiBody({
    type: CreateSubscriptionDto,
    description: 'Данные для создания подписки',
    examples: {
      example1: {
        summary: 'Пример запроса',
        value: {
          userId: 1,
          productId: 1,
        },
      },
    },
  })
  create(@Body() createSub: CreateSubscriptionDto) {
    // console.log('POST запрос на создание подписки:', {
    //   body: createSub,
    // });
    return this.subscriptionService.create(createSub);
  }
}
