import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateBalanceDto {
  @ApiProperty({
    example: 100.5,
    description:
      'Сумма для изменения баланса (положительная для пополнения, отрицательная для списания)',
    type: Number,
  })
  @IsNumber({}, { message: 'Сумма должна быть числом' })
  @Min(0.01, { message: 'Минимальная сумма операции: 0.01' })
  amount: number;

  @ApiProperty({
    example: 'deposit',
    description: 'Тип операции',
    enum: ['deposit', 'withdraw', 'purchase', 'refund'],
  })
  @IsEnum(['deposit', 'withdraw', 'purchase', 'refund'], {
    message:
      'Тип операции должен быть одним из: deposit, withdraw, purchase, refund',
  })
  type: string;

  @ApiProperty({
    example: 'Пополнение баланса',
    description: 'Причина изменения баланса',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Причина должна быть строкой' })
  reason?: string;

  @ApiProperty({
    example: { paymentId: 'pay_123', method: 'card' },
    description: 'Дополнительные метаданные',
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
