import { getSchemaPath } from '@nestjs/swagger'

import { type SchemaRef, type WsDocs, jsonContent } from '@/common/swagger'

import { ResponseConversationDto } from './dto'

export const CONVERSATION_WS_MODELS = [ResponseConversationDto] as const

export function buildConversationWsDocs(authDescription: string): WsDocs {
  const conversationSchema: SchemaRef = {
    $ref: getSchemaPath(ResponseConversationDto)
  }
  const deletedConversationSchema: SchemaRef = {
    type: 'object',
    properties: { deletedConversationId: { type: 'integer' } },
    required: ['deletedConversationId']
  }

  return {
    tags: [
      {
        name: 'WS: Conversations',
        description: `Socket.IO namespace \`/conversations\`. ${authDescription}`
      }
    ],
    paths: {
      '/ws/conversations/event-conversation-new': {
        post: {
          tags: ['WS: Conversations'],
          summary: 'conversation:new (server -> client)',
          description: 'Emitted when a new conversation is created.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(conversationSchema)
            }
          }
        }
      },
      '/ws/conversations/event-conversation-deleted': {
        post: {
          tags: ['WS: Conversations'],
          summary: 'conversation:deleted (server -> client)',
          description: 'Emitted when a conversation is deleted.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(deletedConversationSchema)
            }
          }
        }
      }
    }
  }
}
