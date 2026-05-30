import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({ example: 1, description: 'ID транзакции' })
  id: string;

  @ApiProperty({ example: 100.5, description: 'Сумма операции' })
  amount: number;

  @ApiProperty({
    example: 'deposit',
    description: 'Тип операции',
    enum: ['deposit', 'withdraw', 'purchase', 'refund'],
  })
  type: string;

  @ApiProperty({
    example: 'Пополнение баланса',
    description: 'Причина операции',
    required: false,
  })
  reason?: string;

  @ApiProperty({ example: 0, description: 'Баланс до операции' })
  balanceBefore: number;

  @ApiProperty({ example: 100.5, description: 'Баланс после операции' })
  balanceAfter: number;

  @ApiProperty({
    example: '2024-01-01T10:00:00.000Z',
    description: 'Дата создания',
  })
  createdAt: Date;
}
