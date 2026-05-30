import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from '../database/database.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class UserService {
  constructor(
    private readonly dataBase: DatabaseService,
    private transactionsService: TransactionService,
  ) {}

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
        balance: createUserDto.balance || 0,
      },
    });
    return this.toUserResponseDto(user);
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.dataBase.user.findFirst({
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
    id: string,
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

  async updateBalance(
    id: string,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<UserResponseDto> {
    return this.dataBase.$transaction(async (dataBase) => {
      // Проверяем существование пользователя
      const user = await dataBase.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Рассчитываем новый баланс
      const newBalance = Number(user.balance) + updateBalanceDto.amount;

      // Проверяем, чтобы баланс не стал отрицательным
      if (newBalance < 0) {
        throw new BadRequestException('Недостаточно средств на балансе');
      }

      // Обновляем баланс
      const updatedUser = await dataBase.user.update({
        where: { id },
        data: {
          balance: newBalance,
        },
      });

      // Создаем запись о транзакции
      await this.transactionsService.createTransaction(
        id,
        updateBalanceDto.amount,
        updateBalanceDto.type,
        updateBalanceDto.reason,
        updateBalanceDto.metadata,
        Number(user.balance),
      );

      return this.toUserResponseDto(updatedUser);
    });
  }

  async getBalance(id: string): Promise<{ balance: number }> {
    const user = await this.dataBase.user.findUnique({
      where: { id },
      select: { balance: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return { balance: Number(user.balance) };
  }

  async getUserTransactions(id: string, limit?: number, page?: number) {
    return this.transactionsService.getUserTransactions(id, limit, page);
  }

  async delete(id: string): Promise<void> {
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
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      balance: +user.balance,
    };
  }
}
