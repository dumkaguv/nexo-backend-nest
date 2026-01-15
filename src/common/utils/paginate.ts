/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, PrismaClient } from '@prisma/client'

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
) => unknown | Promise<unknown>

type ComputedMap<Key extends PrismaModelKey, Select, Include, Context> = Record<
  string,
  ComputedFn<Key, Select, Include, Context>
>

type ComputedValues<C extends Record<string, (...args: any[]) => any>> = {
  [K in keyof C]: Awaited<ReturnType<C[K]>>
}

type PaginateParams<
  Key extends PrismaModelKey,
  Select,
  Include,
  Context
> = Context extends undefined
  ? PaginateBaseParams<Key, Select, Include> & {
      computed?: ComputedMap<Key, Select, Include, undefined>
      context?: undefined
    }
  : PaginateBaseParams<Key, Select, Include> & {
      computed?: ComputedMap<Key, Select, Include, Context>
      context: Context
    }

type ModelClient<
  Key extends PrismaModelKey,
  Select extends ModelFindManyArgs<Key>['select'],
  Include extends ModelFindManyArgs<Key>['include']
> = {
  findMany(
    args: Prisma.SelectSubset<
      ModelFindManyArgs<Key> & {
        skip?: number
        take?: number
        orderBy?: Record<string, 'asc' | 'desc'>
      },
      ModelFindManyArgs<Key>
    >
  ): Prisma.PrismaPromise<ModelRecord<Key, Select, Include>[]>
  count(args: { where?: ModelWhere<Key> }): Prisma.PrismaPromise<number>
}

export async function paginate<
  Key extends PrismaModelKey,
  Select extends ModelFindManyArgs<Key>['select'] = undefined,
  Include extends ModelFindManyArgs<Key>['include'] = undefined,
  Context = undefined
>(
  params: PaginateParams<Key, Select, Include, Context> & {
    computed?: undefined
  }
): Promise<{
  data: ModelRecord<Key, Select, Include>[]
  total: number
}>

export async function paginate<
  Key extends PrismaModelKey,
  Select extends ModelFindManyArgs<Key>['select'] = undefined,
  Include extends ModelFindManyArgs<Key>['include'] = undefined,
  Context = undefined,
  C extends ComputedMap<Key, Select, Include, Context> = ComputedMap<
    Key,
    Select,
    Include,
    Context
  >
>(
  params: PaginateParams<Key, Select, Include, Context> & { computed: C }
): Promise<{
  data: (ModelRecord<Key, Select, Include> & ComputedValues<C>)[]
  total: number
}>

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
}: PaginateParams<Key, Select, Include, Context>): Promise<{
  data: any[]
  total: number
}> {
  const skip = ((page ?? DEFAULT_PAGE) - 1) * (pageSize ?? DEFAULT_PAGE_SIZE)
  const take = pageSize ?? DEFAULT_PAGE_SIZE

  let orderBy: Record<string, 'asc' | 'desc'> | undefined

  if (ordering) {
    const direction = ordering.startsWith('-') ? 'desc' : 'asc'
    const field = ordering.replace(/^-/, '')

    orderBy = { [field]: direction }
  }

  const modelClient = prisma[model] as unknown as ModelClient<
    Key,
    Select,
    Include
  >

  const capitalizedModel =
    String(model)[0].toUpperCase() + String(model).slice(1).toLowerCase()

  const prismaModel = Prisma.dmmf.datamodel.models.find(
    (m) => m.name === capitalizedModel
  )

  let where: ModelWhere<Key> | undefined = whereParam as any

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

      where = whereParam
        ? ({ AND: [whereParam, searchWhere] } as ModelWhere<Key>)
        : searchWhere
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
    } as any),
    modelClient.count({ where })
  ])

  if (!computed) {
    return { data, total }
  }

  const resultData = await Promise.all(
    data.map(async (record) => {
      const helpers = { prisma, context } as {
        prisma: PrismaClient
        context: Context
      }
      const computedValues: Record<string, unknown> = {}

      for (const [key, fn] of Object.entries(computed)) {
        computedValues[key] = await fn(record as any, helpers as any)
      }

      return { ...record, ...computedValues }
    })
  )

  return { data: resultData, total }
}
