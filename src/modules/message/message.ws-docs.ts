import { getSchemaPath } from '@nestjs/swagger'

import { type SchemaRef, type WsDocs, jsonContent } from '@/common/utils'

import {
  CreateMessageDto,
  DeleteMessageDto,
  ResponseMessageDto,
  UpdateMessageDto
} from './dto'

export const MESSAGE_WS_MODELS = [
  CreateMessageDto,
  UpdateMessageDto,
  DeleteMessageDto,
  ResponseMessageDto
] as const

export function buildMessageWsDocs(authDescription: string): WsDocs {
  const messageSchema: SchemaRef = { $ref: getSchemaPath(ResponseMessageDto) }
  const deletedMessageSchema: SchemaRef = {
    type: 'object',
    properties: { deletedMessageId: { type: 'integer' } },
    required: ['deletedMessageId']
  }

  return {
    tags: [
      {
        name: 'WS: Messages',
        description: `Socket.IO namespace \`/messages\`. ${authDescription}`
      }
    ],
    paths: {
      '/ws/messages/message-send': {
        post: {
          tags: ['WS: Messages'],
          summary: 'message:send (client -> server)',
          description:
            'Client emits `message:send`. Server acknowledges with the created message and emits `message:new` (receiver) and `message:sent` (sender).',
          requestBody: {
            required: true,
            content: jsonContent({ $ref: getSchemaPath(CreateMessageDto) })
          },
          responses: {
            '200': {
              description: 'Ack payload.',
              content: jsonContent(messageSchema)
            }
          }
        }
      },
      '/ws/messages/message-update': {
        post: {
          tags: ['WS: Messages'],
          summary: 'message:update (client -> server)',
          description:
            'Client emits `message:update`. Server acknowledges with the updated message and emits `message:updated` to both participants.',
          requestBody: {
            required: true,
            content: jsonContent({ $ref: getSchemaPath(UpdateMessageDto) })
          },
          responses: {
            '200': {
              description: 'Ack payload.',
              content: jsonContent(messageSchema)
            }
          }
        }
      },
      '/ws/messages/message-delete': {
        post: {
          tags: ['WS: Messages'],
          summary: 'message:delete (client -> server)',
          description:
            'Client emits `message:delete`. Server emits `message:deleted` to both participants.',
          requestBody: {
            required: true,
            content: jsonContent({ $ref: getSchemaPath(DeleteMessageDto) })
          },
          responses: {
            '204': {
              description: 'No ack payload.'
            }
          }
        }
      },
      '/ws/messages/event-message-new': {
        post: {
          tags: ['WS: Messages'],
          summary: 'message:new (server -> client)',
          description: 'Emitted to the receiver when a new message is created.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(messageSchema)
            }
          }
        }
      },
      '/ws/messages/event-message-sent': {
        post: {
          tags: ['WS: Messages'],
          summary: 'message:sent (server -> client)',
          description: 'Emitted to the sender after `message:send` succeeds.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(messageSchema)
            }
          }
        }
      },
      '/ws/messages/event-message-updated': {
        post: {
          tags: ['WS: Messages'],
          summary: 'message:updated (server -> client)',
          description: 'Emitted to both participants after a message update.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(messageSchema)
            }
          }
        }
      },
      '/ws/messages/event-message-deleted': {
        post: {
          tags: ['WS: Messages'],
          summary: 'message:deleted (server -> client)',
          description:
            'Emitted to both participants after a message is deleted.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(deletedMessageSchema)
            }
          }
        }
      }
    }
  }
}
