export type ConversationWithUsers = {
  id: number
  senderId: number
  receiverId: number
  createdAt: Date
  updatedAt: Date
  sender: unknown
  receiver: unknown
}
