import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен доступа',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Данные пользователя',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
