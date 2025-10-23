import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters'
import { ResponseInterceptor } from './common/interceptors'
import { setupSwagger } from './common/utils'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние поля из запроса
      forbidNonWhitelisted: true, // если есть лишние поля — выбросить ошибку
      transform: true, // автоматически преобразует типы, например "id" в число
      exceptionFactory: (errors) => {
        // errors — массив ValidationError, можно кастомно вернуть объект
        const formatted = errors.map((err) => ({
          field: err.property,
          constraints: err.constraints
        }))

        return new BadRequestException({
          message: 'Validation failed',
          errors: formatted
        })
      }
    })
  )

  app.useGlobalInterceptors(app.get(ResponseInterceptor))

  app.useGlobalFilters(app.get(AllExceptionsFilter))

  setupSwagger(app)

  app.getHttpAdapter().get('/', (_req, res) => {
    res.redirect('/api')
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
