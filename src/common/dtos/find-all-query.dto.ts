/* eslint-disable @typescript-eslint/no-explicit-any */

import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class FindAllQueryDto<T = any> {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  ordering?: `${Extract<keyof T, string>}` | `-${Extract<keyof T, string>}`
}
