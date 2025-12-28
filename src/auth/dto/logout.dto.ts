import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    example: 'all',
    description:
      'Выход со всех устройств (all) или только с текущего (current)',
    required: false,
    enum: ['all', 'current'],
  })
  @IsOptional()
  @IsString({ message: 'Тип выхода должен быть строкой' })
  type?: 'all' | 'current';
}
