/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma } from '@prisma/client'

import { PrismaClient } from '@prisma/client'

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/common/constants'

type PrismaModelDelegate = {
  findMany: (args?: unknown) => unknown
  count: (args?: unknown) => unknown
}

type PrismaModelKey = {
  [Key in keyof PrismaClient]: PrismaClient[Key] extends PrismaModelDelegate
    ? Key
    : never
}[keyof PrismaClient]

type ModelFindManyArgs<Key extends PrismaModelKey> = Prisma.Args<
  PrismaClient[Key],
  'findMany'
>

type ModelWhere<Key extends PrismaModelKey> = ModelFindManyArgs<Key>['where']

type ModelOrderBy<Key extends PrismaModelKey> =
  ModelFindManyArgs<Key>['orderBy']

type OrderByInput<Key extends PrismaModelKey> =
  NonNullable<ModelOrderBy<Key>> extends (infer Item)[]
    ? Item
    : NonNullable<ModelOrderBy<Key>>

type OrderByKeys<Key extends PrismaModelKey> = Extract<
  keyof OrderByInput<Key>,
  string
>

type SelectionArgs<Select, Include> = ([Select] extends [undefined | null]
  ? {}
  : { select: Exclude<Select, undefined | null> }) &
  ([Include] extends [undefined | null]
    ? {}
    : { include: Exclude<Include, undefined | null> })

type ModelRecord<Key extends PrismaModelKey, Select, Include> = Prisma.Result<
  PrismaClient[Key],
  Prisma.SelectSubset<SelectionArgs<Select, Include>, ModelFindManyArgs<Key>>,
  'findMany'
>[number]

type PaginateBaseParams<Key extends PrismaModelKey, Select, Include> = {
  prisma: PrismaClient
  model: Key
  page?: number
  pageSize?: number
  ordering?: `${OrderByKeys<Key>}` | `-${OrderByKeys<Key>}` | string
  search?: string
  select?: Select
  include?: Include
  where?: ModelFindManyArgs<Key>['where']
}

type ComputedFn<Key extends PrismaModelKey, Select, Include, Context> = (
  record: ModelRecord<Key, Select, Include>,
  helpers: { prisma: PrismaClient; context: Context }
) => any | Promise<any>

type PaginateParams<
  Key extends PrismaModelKey,
  Select,
  Include,
  Context = undefined
> = Context extends undefined
  ? PaginateBaseParams<Key, Select, Include> & {
      computed?: Record<string, ComputedFn<Key, Select, Include, undefined>>
      context?: undefined
    }
  : PaginateBaseParams<Key, Select, Include> & {
      computed?: Record<string, ComputedFn<Key, Select, Include, Context>>
      context: Context
    }

export async function paginate<
  Key extends PrismaModelKey,
  Select extends ModelFindManyArgs<Key>['select'] = undefined,
  Include extends ModelFindManyArgs<Key>['include'] = undefined,
  Context = undefined
>({
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
}: PaginateParams<Key, Select, Include, Context>) {
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

  let where: ModelWhere<Key> | undefined = whereParam

  if (search && prismaModel) {
    const stringFields = prismaModel.fields
      .filter(({ type }) => type === 'String')
      .map(({ name }) => ({ field: name }))

    if (stringFields.length > 0) {
      const searchWhere = {
        OR: stringFields.map(({ field }) => ({
          [field]: { contains: search, mode: 'insensitive' }
        }))
      } as ModelWhere<Key>

      if (whereParam) {
        where = { AND: [whereParam, searchWhere] } as ModelWhere<Key>
      } else {
        where = searchWhere
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
        const helpers = { prisma, context } as {
          prisma: PrismaClient
          context: Context
        }

        for (const [key, fn] of Object.entries(computed)) {
          computedValues[key] = await fn(record, helpers)
        }

        return { ...record, ...computedValues }
      })
    )
  }

  return { data: resultData, total }
}
