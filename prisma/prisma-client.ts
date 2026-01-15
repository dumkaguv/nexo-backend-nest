import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line func-style
const prismaClientSingleton = () => new PrismaClient()

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
