import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from '../auth.service';

@Injectable()
export class CleanupSessionsTask {
  private readonly logger = new Logger(CleanupSessionsTask.name);

  constructor(private authService: AuthService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Запуск очистки просроченных сессий...');

    try {
      const deletedCount = await this.authService.cleanupExpiredSessions();

      if (deletedCount > 0) {
        this.logger.log(`Удалено ${deletedCount} просроченных сессий`);
      } else {
        this.logger.debug('Нет просроченных сессий для удаления');
      }
    } catch (error) {
      this.logger.error('Ошибка при очистке сессий:', error);
    }
  }
}
