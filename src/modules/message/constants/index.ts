export const MESSAGE_NAMESPACE = '/messages' as const

export const CLIENT_TO_SERVER = {
  SEND: 'message:send',
  DELETE: 'message:delete',
  UPDATE: 'message:update'
} as const

export const SERVER_TO_CLIENT = {
  NEW: 'message:new',
  SENT: 'message:sent',

  DELETED: 'message:deleted',

  UPDATED: 'message:updated'
} as const
