import { DiscriminatorObject } from '@oats-ts/json-schema-model'
import { shape, object, optional, string } from '@oats-ts/validators'

export const discriminatorObject = object(
  shape<DiscriminatorObject>({
    mapping: optional(object()),
    propertyName: string(),
  }),
)
