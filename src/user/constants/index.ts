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
