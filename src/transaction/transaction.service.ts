import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionType } from '../generated/prisma/client/enums';

@Injectable()
export class TransactionService {
  constructor(private readonly dataBase: DatabaseService) {}

  async getUserTransactions(id: string, limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.dataBase.balanceTransaction.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.dataBase.balanceTransaction.count({
        where: { userId: id },
      }),
    ]);

    return {
      transactions: transactions.map(this.toTransactionResponseDto),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async createTransaction(
    id: string,
    amount: number,
    type: string,
    reason?: string,
    metadata?: Record<string, any>,
    balanceBefore?: number,
  ): Promise<TransactionResponseDto> {
    // Получаем текущий баланс пользователя
    const user = await this.dataBase.user.findUnique({
      where: { id: id },
      select: { balance: true },
    });

    const currentBalance = user ? Number(user.balance) : 0;
    const balanceAfter = currentBalance + amount;

    const transaction = await this.dataBase.balanceTransaction.create({
      data: {
        userId: id,
        amount,
        type: type as TransactionType, // ← приводим к типу enum,
        reason,
        balanceBefore: currentBalance,
        balanceAfter,
        metadata: metadata || {},
      },
    });

    return this.toTransactionResponseDto(transaction);
  }

  private toTransactionResponseDto(transaction: any): TransactionResponseDto {
    return {
      id: transaction.id,
      amount: Number(transaction.amount),
      type: transaction.type,
      reason: transaction.reason || undefined,
      balanceBefore: Number(transaction.balanceBefore),
      balanceAfter: Number(transaction.balanceAfter),
      createdAt: transaction.createdAt,
    };
  }
}
