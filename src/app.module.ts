import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { HotelController } from './modules/hotel/hotel.controller';
import { ReservationModule } from './modules/reservation/reservation.module';
import { ReservationController } from './modules/reservation/reservation.controller';

@Module({
  imports: [UserModule, DatabaseModule, HotelModule, ReservationModule],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.POST },
        { path: '/user/signup', method: RequestMethod.POST },
      )
      .forRoutes(UserController, HotelController, ReservationController);
  }
}
