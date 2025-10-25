import type { Prisma } from '@prisma/client'

export const selectFieldsWithoutPassword: Omit<
  Prisma.UserSelectScalar,
  'password'
> = {
  id: true,
  email: true,
  userName: true,
  activationLink: true,
  createdAt: true,
  updatedAt: true
} as const

export const selectUserWithRelations: Omit<Prisma.UserSelect, 'password'> = {
  ...selectFieldsWithoutPassword,
  profile: true,
  posts: true,
  likesOnPosts: true,
  followers: true,
  following: true,
  comments: true,
  sentMessages: true,
  receivedMessages: true
} as const
