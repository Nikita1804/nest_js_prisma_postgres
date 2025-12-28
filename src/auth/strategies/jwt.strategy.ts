import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../../config/jwt.config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    // Извлекаем токен из заголовка
    const authHeader = request.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Токен не предоставлен');
    }

    // Проверяем валидность токена через сервис
    const isValid = await this.authService.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException(
        'Токен недействителен или сессия истекла',
      );
    }

    return {
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      sessionId: payload.sessionId,
      exp: payload.exp,
      iat: payload.iat,
    };
  }
}
