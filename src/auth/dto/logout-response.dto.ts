import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    example: true,
    description: 'Успешность выхода',
  })
  success: boolean;

  @ApiProperty({
    example: 'Вы успешно вышли из системы',
    description: 'Сообщение о результате',
  })
  message: string;

  @ApiProperty({
    example: 1,
    description: 'Количество удаленных сессий',
    required: false,
  })
  deletedSessions?: number;
}
