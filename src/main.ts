import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters'
import { ResponseInterceptor } from './common/interceptors'
import { setupSwagger } from './common/utils'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.use(cookieParser())

  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true
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
