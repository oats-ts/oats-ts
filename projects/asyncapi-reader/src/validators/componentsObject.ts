import { ComponentsObject } from '@oats-ts/asyncapi-model'
import { shape, object, optional } from '@oats-ts/validators'
import { recordOfObjects } from './recordOfObjects'

export const componentsObject = object(
  shape<ComponentsObject>({
    schemas: optional(recordOfObjects),
    parameters: optional(recordOfObjects),
    securitySchemes: optional(recordOfObjects),
  }),
)
