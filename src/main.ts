import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

// App module
import { AppModule } from './app.module';

// Configs
import config, { Environment } from '@src/config';
import { corsConfig, injectGlobally, swaggerConfig } from '@config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // inject middlewares, Pipes, and interceptors
  injectGlobally(app);

  const configService: ConfigService<Environment> = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix(configService.get(config.BACKEND_PREFIX));

  // Swagger config
  swaggerConfig(configService, app);

  // Cors config
  app.enableCors(corsConfig(configService.get(config.CORS_URLS)));

  // Port binding
  await app.listen(configService.get(config.PORT));

  console.log('backend success initialized');
}
bootstrap();
