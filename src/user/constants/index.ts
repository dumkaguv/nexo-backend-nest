import type { Prisma } from '@prisma/client'

export const selectUserFields: Prisma.UserSelectScalar = {
  id: true,
  email: true,
  username: true,
  activationLink: true,
  createdAt: true,
  updatedAt: true
} as const

export const selectUserWithRelations: Prisma.UserSelect = {
  ...selectUserFields,
  profile: true,
  posts: true,
  likesOnPosts: true,
  followers: true,
  following: true,
  comments: true,
  sentMessages: true,
  receivedMessages: true
} as const
