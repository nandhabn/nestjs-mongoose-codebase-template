import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Config
import Config, { Environment } from '@src/config';
import { TrimPipe } from '@src/shared/pipes/trim.pipe';

/**
 * Returns Nest mongoose configurations
 * @docs https://docs.nestjs.com/techniques/mongodb
 */
export const MongooseModuleConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  // ** Warning - TypeScript not working for this config so modify carefully
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get(Config.MONGO_URI),
    useNewUrlParser: true,
  }),
  inject: [ConfigService],
};

/**
 * Prevents from Dos attacks
 * @docs https://docs.nestjs.com/security/rate-limiting
 */
export const throttlerConfig: ThrottlerModuleOptions = {
  ttl: 60,
  limit: 15,
};

/**
 * @docs https://docs.nestjs.com/security/cors#cors , https://github.com/expressjs/cors#configuration-options
 * @param corsUrls List of cors urls
 * @returns Cors configuration
 */
export const corsConfig = (corsUrls): CorsOptions => ({
  origin: corsUrls,
});

/**
 * Add middlewares, pipes and interceptors
 */
export const injectGlobally = (app: INestApplication) => {
  // Global middlewares
  app.use(helmet(), cookieParser());

  // Global pipes
  // For handling validation of input data
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }), new TrimPipe());

  // Global Interceptors
  // To validate the response data
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
};

/**
 * Configs swagger
 * @docs https://docs.nestjs.com/openapi/introduction
 * @param configService config service instance
 * @param app app instance
 */
export const swaggerConfig = (
  configService: ConfigService<Environment>,
  app: INestApplication,
) => {
  const conf = new DocumentBuilder()
    .setTitle(configService.get(Config.SWAGGER_TITLE))
    .setDescription(configService.get(Config.SWAGGER_DESCRIPTION))
    .setVersion(configService.get(Config.SWAGGER_VERSION))
    .build();

  const document = SwaggerModule.createDocument(app, conf);

  const swaggerUrl = `${configService.get(
    Config.BACKEND_PREFIX,
  )}/${configService.get(Config.SWAGGER_PREFIX)}`;

  SwaggerModule.setup(swaggerUrl, app, document);
};
