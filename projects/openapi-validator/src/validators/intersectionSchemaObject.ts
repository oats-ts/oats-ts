import { SchemaObject } from '@oats-ts/json-schema-model'
import {
  Issue,
  object,
  shape,
  combine,
  array,
  items,
  minLength,
  ShapeInput,
  restrictKeys,
  optional,
  string,
} from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { flatMap } from 'lodash'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from '../validators/referenceable'

const intersectionShape: ShapeInput<SchemaObject> = {
  description: optional(string()),
  allOf: array(combine(items(object()), minLength(1))),
}

const validator = object(combine(shape<SchemaObject>(intersectionShape), restrictKeys(Object.keys(intersectionShape))))

export const intersectionSchemaObject =
  (alternatives: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() =>
      ordered(() => validator(data, context.uriOf(data), validatorConfig))(() =>
        flatMap(data.allOf, (schema): Issue[] => referenceable(alternatives)(schema, context, config)),
      ),
    )
  }
