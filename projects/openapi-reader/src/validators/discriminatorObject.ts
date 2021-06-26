import { DiscriminatorObject } from 'openapi3-ts'
import { shape, object, optional, string } from '@oats-ts/validators'

export const discriminatorObject = object(
  shape<DiscriminatorObject>({
    mapping: optional(object()),
    propertyName: string(),
  }),
)
