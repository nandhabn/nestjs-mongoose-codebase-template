import { ApiResponse } from '@nestjs/swagger';

export const SuccessResponse = (description: string, status = 200) =>
  ApiResponse({
    status,
    description,
  });

export const ErrorResponse = (description: string, status: number) =>
  ApiResponse({
    status,
    description,
  });
