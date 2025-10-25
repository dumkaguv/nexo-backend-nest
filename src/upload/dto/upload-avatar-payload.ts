/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiProperty } from '@nestjs/swagger'

export class UploadAvatarPayload {
  @ApiProperty({
    type: 'string',
    format: 'binary'
  })
  file: any
}
