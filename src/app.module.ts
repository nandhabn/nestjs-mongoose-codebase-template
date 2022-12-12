// nest imports
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// App imports
import { MongooseModuleConfig, throttlerConfig } from './config/app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configs
import { parse } from '@src/config';

// Module imports
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    // Always import first
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [parse],
    }),

    // Mongoose Config
    MongooseModule.forRootAsync(MongooseModuleConfig),

    /**
     * Prevents from Dos attacks
     * @docs https://docs.nestjs.com/security/rate-limiting
     */
    ThrottlerModule.forRoot(throttlerConfig),

    // Custom modules
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
