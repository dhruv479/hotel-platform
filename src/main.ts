import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './common/guards/roles.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { Constants } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapter = app.get(HttpAdapterHost);

  app
    .useGlobalGuards(new RolesGuard(new Reflector()))
    .useGlobalInterceptors(new ResponseInterceptor())
    .useGlobalPipes(
      new ValidationPipe({
        transform: false,
        whitelist: true,
      }),
    )
    .useGlobalFilters(new AllExceptionsFilter(httpAdapter))
    .use(helmet())
    .setGlobalPrefix('api', {
      exclude: [{ path: '/', method: RequestMethod.GET }],
    });

  await app.listen(Number(process.env.PORT) || Constants.PORT);
}
bootstrap();
