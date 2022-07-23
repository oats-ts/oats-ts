import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import {
  Issue,
  object,
  optional,
  shape,
  combine,
  literal,
  union,
  ShapeInput,
  restrictKeys,
  string,
} from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

const recordShape: ShapeInput<SchemaObject> = {
  type: optional(literal('object')),
  description: optional(string()),
  additionalProperties: union({
    false: literal(false),
    schema: object(),
  }),
}

const validator = object(combine(shape<SchemaObject>(recordShape), restrictKeys(Object.keys(recordShape))))

export const recordSchemaObject =
  (additionalProperties: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() =>
      ordered(() => validator(data, context.uriOf(data), validatorConfig))(() =>
        referenceable(additionalProperties)(
          data.additionalProperties as SchemaObject | ReferenceObject,
          context,
          config,
        ),
      ),
    )
  }
