import { OperationObject, OperationTraitObject } from '@oats-ts/asyncapi-model'
import { shape, object, optional, string, array, items, ShapeInput } from '@oats-ts/validators'

const operationTraitShape: ShapeInput<OperationTraitObject> = {
  tags: optional(array(items(string()))),
  summary: optional(string()),
  description: optional(string()),
  externalDocs: optional(object()),
  operationId: string(),
  bindings: optional(object()),
}

export const operationTraitObject = object(shape<OperationTraitObject>(operationTraitShape))

export const operationObject = object(
  shape<OperationObject>({
    ...operationTraitShape,
    message: optional(object()),
    traits: optional(object()),
  }),
)
