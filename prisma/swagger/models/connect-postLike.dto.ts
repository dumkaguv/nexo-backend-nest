import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

export class PostLikeUserIdPostIdUniqueInputDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  userId: number
  @ApiProperty({
    type: 'integer',
    format: 'int32'
  })
  postId: number
}

@ApiExtraModels(PostLikeUserIdPostIdUniqueInputDto)
export class ConnectPostLikeDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false
  })
  id?: number
  @ApiProperty({
    type: PostLikeUserIdPostIdUniqueInputDto,
    required: false
  })
  userId_postId?: PostLikeUserIdPostIdUniqueInputDto
}
