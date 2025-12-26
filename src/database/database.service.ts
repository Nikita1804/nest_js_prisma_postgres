import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = `${process.env.POSTGRES_URI}`;
    if (!connectionString) {
      throw new Error('Missing POSTGRES_URI (set it in .env)');
    }

    const pool = new Pool({
      connectionString,
    });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma Client connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma Client disconnected');
  }
}
