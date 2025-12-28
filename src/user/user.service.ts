import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from '../database/database.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.dataBase.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.toUserResponseDto(user);
  }

  async findByEmail(email: string) {
    return this.dataBase.user.findUnique({
      where: { email },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Проверяем существование пользователя
    const existingUser = await this.dataBase.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем уникальность email, если он меняется
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.dataBase.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      email: updateUserDto.email,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
    };

    // Хешируем пароль, если он предоставлен
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Обновляем пользователя
    const updatedUser = await this.dataBase.user.update({
      where: { id },
      data: updateData,
    });

    return this.toUserResponseDto(updatedUser);
  }

  async delete(id: number): Promise<void> {
    const existingUser = await this.dataBase.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.dataBase.user.delete({
      where: { id },
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
