import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PhoneService } from './phone.service';
import { Prisma } from 'src/generated/prisma/client/client';

@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPhoneDto: Prisma.PhoneCreateInput) {
    return this.phoneService.create(createPhoneDto);
  }
}
