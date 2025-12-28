import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'Новый email',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Новое имя',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  firstName?: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Новая фамилия',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Фамилия должна быть строкой' })
  lastName?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Новый пароль',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой' })
  password?: string;
}
