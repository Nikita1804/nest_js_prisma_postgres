import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsConfig(config: ConfigService): CorsOptions {
  return {
    origin: config.getOrThrow<string>('HTTP_CORS').split(','),
    credentials: true,
  };
}
