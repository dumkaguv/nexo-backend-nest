import { Prisma } from '@prisma/client'

export const USER_NAMESPACE = '/users' as const

export const SERVER_TO_CLIENT = {
  ONLINE: 'user:online',
  OFFLINE: 'user:offline',
  ONLINE_LIST: 'user:online:list'
} as const

export const CLIENT_TO_SERVER = {
  ONLINE_LIST_REQUEST: 'user:online:list:request'
} as const

export const selectUserFields: Prisma.UserSelectScalar = {
  id: true,
  email: true,
  username: true,
  activationLink: true,
  isActivated: true,
  createdAt: true,
  lastActivity: true,
  updatedAt: true
} as const

export const includeUserWithRelations: Prisma.UserInclude = {
  profile: { include: { avatar: true } },
  posts: true,
  likesOnPosts: true,
  following: {
    include: {
      user: {
        include: {
          profile: {
            include: {
              avatar: true
            }
          }
        }
      }
    }
  },
  followers: {
    include: {
      user: {
        include: {
          profile: {
            include: {
              avatar: true
            }
          }
        }
      }
    }
  },
  comments: true,
  sentMessages: true,
  receivedMessages: true
} as const
