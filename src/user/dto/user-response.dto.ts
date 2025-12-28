import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Id пользователя',
  })
  id: number;

  @ApiProperty({
    example: 'user@example@mail.ru',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({
    example: 'Имя',
    description: 'Имя пользователя',
  })
  firstName?: string;

  @ApiProperty({
    example: 'Фамилия',
    description: 'Фамилия пользователя',
  })
  lastName?: string;
}
