import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль (мин. 6 символов)',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  password: string;

  @ApiProperty({
    example: 'Имя',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString({ message: 'Имя должно быть строкой' })
  firstName?: string;

  @ApiProperty({
    example: 'Фамилия',
    description: 'Фамилия пользователя',
    required: false,
  })
  @IsString({ message: 'Фамилия должно быть строкой' })
  lastName?: string;
}
