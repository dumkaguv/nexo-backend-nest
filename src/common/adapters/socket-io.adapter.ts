import { IoAdapter } from '@nestjs/platform-socket.io'

import type { INestApplicationContext } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import type { ServerOptions } from 'socket.io'

export class ConfigurableSocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly configService: ConfigService
  ) {
    super(app)
  }

  createIOServer(port: number, options?: ServerOptions) {
    const origin = this.configService.getOrThrow<string>('FRONT_URL')
    const cors = {
      ...(options?.cors ?? {}),
      origin,
      credentials: true
    }

    return super.createIOServer(port, {
      ...options,
      cors
    })
  }
}
