import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue, object, optional, shape, combine, literal, restrictKeys, ShapeInput, string } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

const arraySchemaObjectShape: ShapeInput<SchemaObject> = {
  description: optional(string()),
  type: optional(literal('array')),
  items: object(),
}

const validator = object(
  combine(shape<SchemaObject>(arraySchemaObjectShape), restrictKeys(Object.keys(arraySchemaObjectShape))),
)

export const arraySchemaObject =
  (items: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() =>
      ordered(() => validator(data, context.uriOf(data), validatorConfig))(() =>
        typeof data.items === 'boolean' ? [] : referenceable(items)(data.items!, context, config),
      ),
    )
  }
