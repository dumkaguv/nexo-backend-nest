/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger
} from '@nestjs/common'

import type { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // Prisma Not Found
    if (exception?.code === 'P2025') {
      this.logger.warn('Resource not found', exception)

      return response.status(404).json({
        success: false,
        message: 'Resource not found'
      })
    }

    // Unique constraint failed
    if (exception?.code === 'P2002') {
      const fields = exception.meta?.target

      return response.status(409).json({
        success: false,
        message: 'Unique constraint failed',
        fields
      })
    }

    // ValidationPipe
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any
      const message = typeof res === 'object' ? res.message : res
      const errors = typeof res === 'object' ? res.errors : null

      this.logger.warn('Validation failed', exception)

      return response.status(400).json({ success: false, message, errors })
    }

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error'

    this.logger.error(message, exception)
    response.status(status).json({ success: false, message })
  }
}
