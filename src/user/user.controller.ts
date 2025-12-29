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
  UseGuards,
  ParseIntPipe,
  Put,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
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

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Получение профиля текущего пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизован',
  })
  async getProfile(
    @CurrentUser() user: UserResponseDto,
  ): Promise<UserResponseDto> {
    console.log(user);
    return this.userService.findById(user.id);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить текущий баланс' })
  @ApiResponse({
    status: 200,
    description: 'Баланс получен',
    schema: {
      example: { balance: 100.5 },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизован',
  })
  async getBalance(
    @CurrentUser() user: UserResponseDto,
  ): Promise<{ balance: number }> {
    return this.userService.getBalance(user.id);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить историю транзакций' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество записей на странице',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'История транзакций',
    schema: {
      example: {
        transactions: [
          {
            id: 1,
            amount: 100,
            type: 'deposit',
            balanceBefore: 0,
            balanceAfter: 100,
            createdAt: '2024-01-01T10:00:00.000Z',
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          pages: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизован',
  })
  async getTransactions(
    @CurrentUser() user: any,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.userService.getUserTransactions(user.id, limit, page);
  }

  @Post('balance/deposit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Пополнить баланс' })
  @ApiBody({ type: UpdateBalanceDto })
  @ApiResponse({
    status: 200,
    description: 'Баланс пополнен',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Неверная сумма',
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизован',
  })
  async depositBalance(
    @CurrentUser() user: UserResponseDto,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<UserResponseDto> {
    // Убеждаемся, что сумма положительная для пополнения
    if (updateBalanceDto.amount <= 0) {
      throw new Error('Сумма пополнения должна быть положительной');
    }
    const depositDto = {
      ...updateBalanceDto,
      type: 'deposit',
    };
    return this.userService.updateBalance(user.id, depositDto);
  }

  @Post('balance/withdraw')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Списать с баланса' })
  @ApiBody({ type: UpdateBalanceDto })
  @ApiResponse({
    status: 200,
    description: 'Средства списаны',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно средств или неверная сумма',
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизован',
  })
  async withdrawBalance(
    @CurrentUser() user: UserResponseDto,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<UserResponseDto> {
    // Убеждаемся, что сумма положительная для списания и меняем знак
    if (updateBalanceDto.amount <= 0) {
      throw new Error('Сумма списания должна быть положительной');
    }

    // Для списания передаем отрицательную сумму
    const withdrawDto = {
      ...updateBalanceDto,
      type: 'withdraw',
      amount: -updateBalanceDto.amount,
    };

    return this.userService.updateBalance(user.id, withdrawDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID пользователя',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Пользователь найден',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизован',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновление профиля текущего пользователя' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Профиль обновлен',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные входные данные',
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизован',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  async updateProfile(
    @CurrentUser() user: UserResponseDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удаление профиля текущего пользователя' })
  @ApiResponse({
    status: 204,
    description: 'Профиль удален',
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизован',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  async deleteProfile(@CurrentUser() user: UserResponseDto): Promise<void> {
    return this.userService.delete(user.id);
  }
}
