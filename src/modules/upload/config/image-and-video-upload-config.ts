/* eslint-disable @typescript-eslint/no-explicit-any */

export function imageAndVideoFileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
) {
  if (
    !file.mimetype.startsWith('image/') &&
    !file.mimetype.startsWith('video/')
  ) {
    return cb(new Error('Only images and videos are allowed'), false)
  }

  cb(null, true)
}
