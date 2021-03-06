import { PathItemObject } from '@oats-ts/openapi-model'
import { shape, object, optional, string, array, items } from '@oats-ts/validators'

export const pathItemObject = object(
  shape<PathItemObject>({
    $ref: optional(string()),
    description: optional(string()),
    summary: optional(string()),
    delete: optional(object()),
    get: optional(object()),
    head: optional(object()),
    options: optional(object()),
    patch: optional(object()),
    post: optional(object()),
    put: optional(object()),
    trace: optional(object()),
    parameters: optional(array(items(object()))),
    servers: optional(array(items(object()))),
  }),
)
