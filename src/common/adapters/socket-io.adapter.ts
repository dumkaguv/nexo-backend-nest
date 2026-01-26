import { INestApplicationContext } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { Server, ServerOptions } from 'socket.io'

export class ConfigurableSocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly configService: ConfigService
  ) {
    super(app)
  }

  public createIOServer(port: number, options?: ServerOptions): Server {
    const origin = this.configService.getOrThrow<string>('FRONT_URL')

    const cors: ServerOptions['cors'] = {
      ...(options?.cors ?? {}),
      origin,
      credentials: true
    }

    return super.createIOServer(port, {
      ...options,
      cors
    }) as Server
  }
}
