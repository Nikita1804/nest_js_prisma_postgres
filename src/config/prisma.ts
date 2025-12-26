import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client/client';
// import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.POSTGRES_URI}`;

const adapter = new PrismaPg({ connectionString });
const Prisma = new PrismaClient({ adapter });

export { Prisma };
