import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

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
    example: 'Списание баланса',
    description: 'Причина изменения баланса',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Причина должна быть строкой' })
  reason?: string;
}
