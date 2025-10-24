import { createParamDecorator } from '@nestjs/common'
import { User } from '@prisma/client'

import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

export function Authorized() {
  return createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request

    const user = request.user

    return data ? user?.[data] : user
  })
}
