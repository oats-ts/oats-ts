import { SchemaObject } from '@oats-ts/json-schema-model'
import { values, flatMap } from 'lodash'
import {
  Issue,
  object,
  optional,
  shape,
  combine,
  array,
  items,
  string,
  literal,
  ShapeInput,
  restrictKeys,
} from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

const objectSchemaShape: ShapeInput<SchemaObject> = {
  type: optional(literal('object')),
  required: optional(array(items(string()))),
  properties: object(),
  description: optional(string()),
}

const validator = object(combine(shape<SchemaObject>(objectSchemaShape), restrictKeys(Object.keys(objectSchemaShape))))

export const objectSchemaObject =
  (properties: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() =>
      ordered(() => validator(data, context.uriOf(data), validatorConfig))(() =>
        flatMap(values(data.properties), (schema) => referenceable(properties)(schema, context, config)),
      ),
    )
  }
