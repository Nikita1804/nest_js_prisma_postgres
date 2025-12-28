import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создание нового пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные входные данные',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Ошибка при создании пользователя');
    }
  }
}
