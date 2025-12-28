import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '3eb9b420-abd4-4e1d-a98c-39e0096ace55',
    description: 'Id пользователя',
  })
  id: string;

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
