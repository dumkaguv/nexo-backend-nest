import { type SchemaRef, type WsDocs, jsonContent } from '@/common/utils'

export function buildUserWsDocs(authDescription: string): WsDocs {
  const userIdSchema: SchemaRef = { type: 'integer' }
  const userIdListSchema: SchemaRef = {
    type: 'array',
    items: { type: 'integer' }
  }

  return {
    tags: [
      {
        name: 'WS: Users',
        description: `Socket.IO namespace \`/users\`. ${authDescription}`
      }
    ],
    paths: {
      '/ws/users/user-online-list-request': {
        post: {
          tags: ['WS: Users'],
          summary: 'user:online:list:request (client -> server)',
          description:
            'Client emits `user:online:list:request`. Server emits `user:online:list` with the current online user ids.',
          responses: {
            '204': {
              description: 'No ack payload.'
            }
          }
        }
      },
      '/ws/users/event-user-online': {
        post: {
          tags: ['WS: Users'],
          summary: 'user:online (server -> client)',
          description: 'Emitted when a user comes online.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(userIdSchema)
            }
          }
        }
      },
      '/ws/users/event-user-offline': {
        post: {
          tags: ['WS: Users'],
          summary: 'user:offline (server -> client)',
          description: 'Emitted when a user goes offline.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(userIdSchema)
            }
          }
        }
      },
      '/ws/users/event-user-online-list': {
        post: {
          tags: ['WS: Users'],
          summary: 'user:online:list (server -> client)',
          description: 'Emitted with the list of currently online user ids.',
          responses: {
            '200': {
              description: 'Event payload.',
              content: jsonContent(userIdListSchema)
            }
          }
        }
      }
    }
  }
}
