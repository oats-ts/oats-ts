import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getRequestBodyContent, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { flatMap, entries } from 'lodash'
import { getRequestBodyValidatorAst } from './getRequestBodyValidatorAst'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getNamedImports } from '@oats-ts/typescript-common'
import { RuntimePackages } from '@oats-ts/model-common'

export function generateRequestBodyValidator(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { pathOf, dependenciesOf, dereference } = context
  const path = pathOf(data.operation, 'openapi/request-body-validator')
  const content = entries(getRequestBodyContent(data, context)).map(
    ([contentType, { schema }]): [string, Referenceable<SchemaObject>] => [contentType, schema],
  )
  if (content.length === 0) {
    return undefined
  }
  const body = dereference(data.operation.requestBody)
  const needsOptional = !Boolean(body?.required)
  const dependencies = [
    ...flatMap(content, ([, schema]) => dependenciesOf(path, schema, 'json-schema/type-validator')),
    ...(needsOptional ? [getNamedImports(RuntimePackages.Validators.name, [RuntimePackages.Validators.optional])] : []),
  ]

  return {
    path,
    dependencies,
    content: [getRequestBodyValidatorAst(data, context)],
  }
}
