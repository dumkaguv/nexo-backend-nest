export const MESSAGE_NAMESPACE = '/messages' as const

export const MESSAGE_EVENTS = {
  SEND: 'message:send'
} as const

export const MESSAGE_SOCKET_EVENTS = {
  NEW: 'message:new',
  SENT: 'message:sent'
} as const
