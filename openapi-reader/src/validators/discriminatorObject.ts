import { DiscriminatorObject } from 'openapi3-ts'
import { fields, object, optional, string } from '@oats-ts/validators'

export const discriminatorObject = object(
  fields<DiscriminatorObject>({
    mapping: optional(object()),
    propertyName: string(),
  }),
)
