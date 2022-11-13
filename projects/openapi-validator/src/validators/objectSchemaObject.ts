import { SchemaObject } from '@oats-ts/json-schema-model'
import { values, flatMap } from 'lodash'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'
import { structural } from '../structural'

export const objectSchemaObject =
  (properties: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() =>
      ordered(() => structural.objectSchemaObject(data, context.uriOf(data), validatorConfig))(() =>
        flatMap(values(data.properties), (schema) => referenceable(properties)(schema, context, config)),
      ),
    )
  }
