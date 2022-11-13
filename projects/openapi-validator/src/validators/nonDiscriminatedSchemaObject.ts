import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { flatMap } from 'lodash'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'
import { schemaObject } from './schemaObject'
import { structural } from '../structural'

export function nonDiscriminatedSchemaObject(
  input: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    input,
  )(() =>
    ordered(() => structural.nonDiscriminatedUnionSchemaObject(input, context.uriOf(input), validatorConfig))(() =>
      flatMap(input.oneOf, (schema: Referenceable<SchemaObject>): Issue[] =>
        referenceable(schemaObject)(schema, context, config),
      ),
    ),
  )
}
