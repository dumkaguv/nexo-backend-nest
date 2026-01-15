import 'dotenv/config'

import type { PrismaConfig } from 'prisma'

export default {
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DATABASE_URL_UNPOOLED
  }
} as PrismaConfig
