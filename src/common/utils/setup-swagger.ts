import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'

import { API_GLOBAL_PREFIX } from '@/common/constants'
import type { WsDocs } from '@/common/swagger/ws-docs'
import {
  buildConversationWsDocs,
  CONVERSATION_WS_MODELS
} from '@/modules/conversation/conversation.ws-docs'
import {
  buildMessageWsDocs,
  MESSAGE_WS_MODELS
} from '@/modules/message/message.ws-docs'
import { buildUserWsDocs } from '@/modules/user/user.ws-docs'

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nexo API')
    .setDescription(
      'Api documentation for social network Nexo. WebSocket events are documented under the WS tags.'
    )
    .setVersion('1.0.0')
    .setContact(
      'dgl',
      'https://github.com/dumkaguv',
      'dmitrii.golovicichin@gmail.com'
    )
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [...MESSAGE_WS_MODELS, ...CONVERSATION_WS_MODELS]
  })
  const theme = new SwaggerTheme()

  addWebSocketDocs(document)

  SwaggerModule.setup(`/${API_GLOBAL_PREFIX}`, app, document, {
    customSiteTitle: 'Nexo API',
    jsonDocumentUrl: '/swagger.json',
    yamlDocumentUrl: '/swagger.yaml',
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
      operationsSorter: 'alpha',
      tagsSorter: 'alpha'
    },
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK)
  })
}

type OpenApiDocument = ReturnType<typeof SwaggerModule.createDocument>

function addWebSocketDocs(document: OpenApiDocument) {
  const authDescription =
    'Auth: JWT via `auth.token` or `Authorization: Bearer <token>` in the handshake.'

  const wsDocs: WsDocs[] = [
    buildMessageWsDocs(authDescription),
    buildConversationWsDocs(authDescription),
    buildUserWsDocs(authDescription)
  ]

  document.tags = [
    ...(document.tags ?? []),
    ...wsDocs.flatMap((doc) => doc.tags)
  ]
  document.paths = wsDocs.reduce(
    (paths, doc) => ({
      ...paths,
      ...doc.paths
    }),
    document.paths
  )
}
