import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client/client';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    return this.databaseService.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.databaseService.user.findMany({
      include: {
        phones: true,
      },
    });
  }

  async findOne(id: number): Promise<any> {
    return this.databaseService.user
      .findFirst({
        where: {
          id,
        },
      })
      .then((user) => {
        if (!user) {
          throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
      });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    await this.findOne(id);
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.databaseService.user.delete({
      where: {
        id,
      },
    });
    return {
      message: `User with id ${id} has been successfully deleted`,
      status: 'success',
    };
  }
}
