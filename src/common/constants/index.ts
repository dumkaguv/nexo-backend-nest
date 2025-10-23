import type { ApiQueryOptions } from '@nestjs/swagger'

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10

export const DEFAULT_GET_QUERY: ApiQueryOptions[] = [
  {
    name: 'page',
    type: 'integer',
    description: 'A page number within the paginated result set.',
    required: false
  },
  {
    name: 'pageSize',
    type: 'integer',
    description: 'Number of results to return per page.',
    required: false
  },
  {
    name: 'ordering',
    type: 'string',
    description: 'Which field to use when ordering the results.',
    required: false
  },
  {
    name: 'search',
    type: 'string',
    description: 'A search term.',
    required: false
  }
] as const
