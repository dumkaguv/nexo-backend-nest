import type { FindAllQueryDto } from '@/common/dtos'

export function getUserSearchWhere(
  { search }: FindAllQueryDto,
  userId?: number
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { userId }

  if (search) {
    where.OR = [
      {
        user: {
          username: { contains: search, mode: 'insensitive' }
        }
      },
      {
        user: {
          profile: {
            fullName: { contains: search, mode: 'insensitive' }
          }
        }
      }
    ]
  }

  return where
}
