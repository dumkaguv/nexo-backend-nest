/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function imageAndVideoFileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: Function
) {
  if (
    !file.mimetype.startsWith('image/') &&
    !file.mimetype.startsWith('video/')
  ) {
    return cb(new Error('Only images and videos are allowed'), false)
  }

  cb(null, true)
}
