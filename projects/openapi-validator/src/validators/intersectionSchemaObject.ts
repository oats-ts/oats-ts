import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { flatMap } from 'lodash'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from '../validators/referenceable'
import { structural } from '../structural'

export const intersectionSchemaObject =
  (alternatives: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() =>
      ordered(() => structural.intersectionSchemaObject(data, context.uriOf(data), validatorConfig))(() =>
        flatMap(data.allOf, (schema): Issue[] => referenceable(alternatives)(schema, context, config)),
      ),
    )
  }
