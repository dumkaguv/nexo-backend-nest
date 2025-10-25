/* eslint-disable @typescript-eslint/no-explicit-any */

export function removeForeignKeysFromResponse(entity: any): any {
  if (Array.isArray(entity)) {
    return entity.map(removeForeignKeysFromResponse)
  }

  if (entity instanceof Date) {
    return entity
  }

  if (entity && typeof entity === 'object') {
    const copy: Record<string, any> = {}

    for (const [key, value] of Object.entries(entity)) {
      if (key.endsWith('Id')) {
        continue
      }

      copy[key] = removeForeignKeysFromResponse(value)
    }

    return copy
  }

  return entity
}
