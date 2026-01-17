import { INestApplicationContext } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'

export class ConfigurableSocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly configService: ConfigService
  ) {
    super(app)
  }

  public createIOServer(port: number, options?: ServerOptions) {
    const origin = this.configService.getOrThrow<string>('FRONT_URL')
    const cors = {
      ...(options?.cors ?? {}),
      origin,
      credentials: true
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super.createIOServer(port, {
      ...options,
      cors
    })
  }
}
