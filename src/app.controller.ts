import { Controller, Get } from '@nestjs/common';

// Decorators
import {
  ErrorResponse,
  SuccessResponse,
} from '@decorators/api-response.decorator';

// Services
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status')
  @SuccessResponse('Server is healthy')
  @ErrorResponse('Server is down', 500)
  status(): string {
    return this.appService.status();
  }
}
