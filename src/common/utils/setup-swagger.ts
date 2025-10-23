import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nexo API')
    .setDescription('Api documentation for social network Nexo')
    .setVersion('1.0.0')
    .setContact(
      'dgl',
      'https://github.com/dumkaguv',
      'dmitrii.golovicichin@gmail.com'
    )
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/api', app, document, {
    customSiteTitle: 'Nexo API',
    jsonDocumentUrl: '/swagger.json',
    yamlDocumentUrl: '/swagger.yaml'
  })
}
