import type { Prisma } from '@prisma/client'

export const selectUserFields: Prisma.UserSelectScalar = {
  id: true,
  email: true,
  username: true,
  activationLink: true,
  isActivated: true,
  createdAt: true,
  updatedAt: true
} as const

export const includeUserWithRelations: Prisma.UserInclude = {
  profile: true,
  posts: true,
  likesOnPosts: true,
  following: {
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  },
  followers: {
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  },
  comments: true,
  sentMessages: true,
  receivedMessages: true
} as const
