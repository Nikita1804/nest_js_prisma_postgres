import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from '../database/database.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly dataBase: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.dataBase.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.dataBase.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      },
    });
    return this.toUserResponseDto(user);
  }
  async findByEmail(email: string) {
    return this.dataBase.user.findUnique({
      where: { email },
    });
  }
  private toUserResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    };
  }
}
