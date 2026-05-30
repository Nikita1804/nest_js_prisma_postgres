import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UserMiddleware } from '../auth/middleware/user.middleware';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [forwardRef(() => AuthModule), TransactionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(UserMiddleware)
      .forRoutes(
        { path: 'user/profile', method: RequestMethod.GET },
        { path: 'user/profile', method: RequestMethod.PUT },
        { path: 'user/profile', method: RequestMethod.DELETE },
        { path: 'user/:id', method: RequestMethod.GET },
      );
  }
}
