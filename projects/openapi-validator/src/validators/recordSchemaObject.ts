import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'
import { structural } from '../structural'

export const recordSchemaObject =
  (additionalProperties: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() =>
      ordered(() => structural.recordSchemaObject(data, context.uriOf(data), validatorConfig))(() =>
        referenceable(additionalProperties)(
          data.additionalProperties as SchemaObject | ReferenceObject,
          context,
          config,
        ),
      ),
    )
  }
