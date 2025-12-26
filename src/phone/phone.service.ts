import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'src/generated/prisma/client/client';

@Injectable()
export class PhoneService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPhoneDto: Prisma.PhoneCreateInput) {
    return this.databaseService.phone.create({
      data: createPhoneDto,
    });
  }
}
