/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma } from '@prisma/client'

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/common/constants'

import type { PrismaClient } from '@prisma/client'

type PaginateParams = {
  prisma: PrismaClient
  model: keyof PrismaClient
  page?: number
  pageSize?: number
  ordering?: string
  search?: string
  select?: Record<string, boolean | object>
  include?: Record<string, boolean | object>
  where?: Record<any, any>
  computed?: Record<
    string,
    (
      record: any,
      helpers: { prisma: PrismaClient; context?: any }
    ) => any | Promise<any>
  >
  context?: any
}

export async function paginate({
  prisma,
  model,
  page,
  pageSize,
  ordering,
  search,
  select,
  include,
  where: whereParam,
  computed,
  context
}: PaginateParams) {
  const skip = ((page ?? DEFAULT_PAGE) - 1) * (pageSize ?? DEFAULT_PAGE_SIZE)
  const take = pageSize ?? DEFAULT_PAGE_SIZE

  let orderBy: Record<string, 'asc' | 'desc'> | undefined

  if (ordering) {
    const direction = ordering.startsWith('-') ? 'desc' : 'asc'
    const field = ordering.replace(/^-/, '')

    orderBy = { [field]: direction }
  }

  const modelClient = (prisma as any)[model]
  const capitalizedModel =
    String(model)[0].toUpperCase() + String(model).slice(1).toLowerCase()
  const prismaModel = Prisma.dmmf.datamodel.models.find(
    (model) => model.name === capitalizedModel
  )

  let where: Record<string, any> | undefined = whereParam

  if (search && prismaModel) {
    const stringFields = prismaModel.fields
      .filter(({ type }) => type === 'String')
      .map(({ name }) => ({ field: name }))

    if (stringFields.length > 0) {
      where = {
        OR: stringFields.map(({ field }) => ({
          [field]: { contains: search, mode: 'insensitive' },
          ...(whereParam || {})
        }))
      }
    }
  }

  const [data, total] = await Promise.all([
    modelClient.findMany({
      skip,
      take,
      orderBy,
      where,
      select,
      include
    }),
    modelClient.count({ where })
  ])

  let resultData = data

  if (computed) {
    resultData = await Promise.all(
      data.map(async (record) => {
        const computedValues: Record<string, any> = {}

        for (const [key, fn] of Object.entries(computed)) {
          computedValues[key] = await fn(record, { prisma, context })
        }

        return { ...record, ...computedValues }
      })
    )
  }

  return { data: resultData, total }
}
