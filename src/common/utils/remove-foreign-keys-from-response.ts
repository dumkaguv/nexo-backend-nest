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

    for (const key of Reflect.ownKeys(entity)) {
      const value = (entity as any)[key]

      if (typeof key === 'string') {
        if (key.length > 2 && key.toLowerCase().endsWith('id')) continue

        copy[key] = removeForeignKeysFromResponse(value)
      }
    }

    return copy
  }

  return entity
}
