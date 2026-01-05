export const MESSAGE_NAMESPACE = '/messages' as const

export const MESSAGE_EVENTS = {
  SEND: 'message:send',
  DELETE: 'message:delete',
  UPDATE: 'message:update'
} as const

export const MESSAGE_SOCKET_EVENTS = {
  NEW: 'message:new',
  SENT: 'message:sent',

  DELETED: 'message:deleted',

  UPDATED: 'message:updated'
} as const
