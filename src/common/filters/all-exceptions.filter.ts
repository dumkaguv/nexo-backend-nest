/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BadRequestException,
  Catch,
  HttpException,
  Logger
} from '@nestjs/common'

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // Prisma Not Found
    if (exception?.code === 'P2025') {
      this.logger.warn('Resource not found', exception)

      return response.status(404).json({
        message: 'Resource not found',
        status: 404
      })
    }

    // Unique constraint failed
    if (exception?.code === 'P2002') {
      const fields = exception.meta?.target

      return response.status(409).json({
        statusCode: 409,
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

      return response.status(400).json({ message, errors, status: 400 })
    }

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error'

    this.logger.error(message, exception)
    response.status(status).json({ message, status })
  }
}
