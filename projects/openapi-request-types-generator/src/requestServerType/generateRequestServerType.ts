import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { values, negate, isNil, flatMap } from 'lodash'
import { getRequestBodyContent, hasInput, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getServerRequestType } from './getServerRequestType'

export function generateRequestServerType(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule {
  if (!hasInput(data, context)) {
    return undefined
  }

  const { pathOf, dependenciesOf } = context
  const { operation } = data

  const path = pathOf(operation, 'openapi/request-server-type')
  const ast = getServerRequestType(data, context)
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.HasIssues, RuntimePackages.Http.HasNoIssues]),
      ...dependenciesOf(path, data.operation, 'openapi/request-type'),
    ],
    content: [ast],
  }
}
