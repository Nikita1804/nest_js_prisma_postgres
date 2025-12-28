import * as bcrypt from 'bcrypt';

import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private dataBaseService: DatabaseService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const payload = {
      email: user.email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      sessionId: '',
    };

    const accessToken = this.jwtService.sign(payload);

    const session = await this.createSession(user.id, accessToken);

    // Обновляем токен с sessionId
    const updatedPayload = { ...payload, sessionId: session.id };
    const finalAccessToken = this.jwtService.sign(updatedPayload);

    // Обновляем сессию с финальным токеном
    await this.dataBaseService.session.update({
      where: { id: session.id },
      data: { token: finalAccessToken },
    });

    return {
      accessToken: finalAccessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async logout(
    token: string,
    logoutDto: LogoutDto = { type: 'current' },
  ): Promise<LogoutResponseDto> {
    try {
      // Валидируем токен
      const payload = this.jwtService.verify(token);

      if (logoutDto.type === 'all') {
        // Удаляем все сессии пользователя
        const result = await this.dataBaseService.session.deleteMany({
          where: { userId: payload.sub },
        });

        return {
          success: true,
          message: 'Вы успешно вышли со всех устройств',
          deletedSessions: result.count,
        };
      } else {
        // Удаляем только текущую сессию
        await this.dataBaseService.session.deleteMany({
          where: {
            id: payload.sessionId,
            userId: payload.sub,
          },
        });

        return {
          success: true,
          message: 'Вы успешно вышли из системы',
          deletedSessions: 1,
        };
      }
    } catch (error) {
      // Если токен невалиден или истек, все равно считаем выход успешным
      return {
        success: true,
        message: 'Сессия завершена',
      };
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      // Проверяем валидность токена
      const payload = this.jwtService.verify(token);

      // Проверяем, существует ли сессия в базе данных
      const session = await this.dataBaseService.session.findUnique({
        where: { id: payload.sessionId },
      });

      // Если сессии нет или она истекла, токен невалиден
      if (!session || new Date(session.expiresAt) < new Date()) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  private async createSession(id: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 часа

    return this.dataBaseService.session.create({
      data: {
        userId: id,
        token,
        expiresAt,
      },
    });
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.dataBaseService.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}
