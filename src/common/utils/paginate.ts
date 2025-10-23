/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma } from '@prisma/client'

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/common/constants'

import type { PrismaClient } from '@prisma/client'

type PaginateParams = {
  prisma: PrismaClient
  model: keyof PrismaClient
  page?: number
  pageSize?: number
  order?: string
  search?: string
}

export async function paginate({
  prisma,
  model,
  page,
  pageSize,
  order,
  search
}: PaginateParams) {
  const skip = ((page ?? DEFAULT_PAGE) - 1) * (pageSize ?? DEFAULT_PAGE_SIZE)
  const take = pageSize ?? DEFAULT_PAGE_SIZE

  let orderBy: Record<string, 'asc' | 'desc'> | undefined
  if (order) {
    const direction = order.startsWith('-') ? 'desc' : 'asc'
    const field = order.replace(/^-/, '')
    orderBy = { [field]: direction }
  }

  const modelClient = (prisma as any)[model]
  const capitalizedModel =
    String(model)[0].toUpperCase() + String(model).slice(1).toLowerCase()
  const prismaModel = Prisma.dmmf.datamodel.models.find(
    (model) => model.name === capitalizedModel
  )

  let where: Record<string, any> | undefined
  if (search && prismaModel) {
    const stringFields = prismaModel.fields
      .filter(({ type }) => type === 'String')
      .map(({ name }) => ({ field: name }))

    if (stringFields.length > 0) {
      where = {
        OR: stringFields.map(({ field }) => ({
          [field]: { contains: search, mode: 'insensitive' }
        }))
      }
    }
  }

  const [data, total] = await Promise.all([
    modelClient.findMany({
      skip,
      take,
      orderBy,
      where
    }),
    modelClient.count({ where })
  ])

  return { data, total }
}
