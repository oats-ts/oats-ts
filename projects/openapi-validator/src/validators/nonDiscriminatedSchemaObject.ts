import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import {
  Issue,
  object,
  optional,
  shape,
  combine,
  array,
  literal,
  minLength,
  ShapeInput,
  restrictKeys,
  string,
} from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { flatMap } from 'lodash'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'
import { schemaObject } from './schemaObject'

const nonDiscUnionShape: ShapeInput<SchemaObject> = {
  description: optional(string()),
  type: optional(literal('object')),
  oneOf: array(minLength(1)),
}

const validator = object(combine(shape<SchemaObject>(nonDiscUnionShape), restrictKeys(Object.keys(nonDiscUnionShape))))

export function nonDiscriminatedSchemaObject(
  input: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    input,
  )(() =>
    ordered(() => validator(input, context.uriOf(input), validatorConfig))(() =>
      flatMap(input.oneOf, (schema: Referenceable<SchemaObject>): Issue[] =>
        referenceable(schemaObject)(schema, context, config),
      ),
    ),
  )
}
