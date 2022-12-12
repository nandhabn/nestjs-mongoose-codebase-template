import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Status api
  status(): string {
    return 'OK';
  }
}
