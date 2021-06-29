import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { entries } from 'lodash'
import { Statement } from 'typescript'
import { getRequestBodyContent, hasInput } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getOperationInputBaseTypeAst } from './getOperationInputBaseTypeAst'
import { getOperationInputUnionTypeAst } from './getOperationInputUnionTypeAst'
import { getModelImports } from '@oats-ts/typescript-common'
import { getOperationInputTypeImports } from './getOperationInputTypeImports'

export function generateOperationInputType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  if (!hasInput(data, context)) {
    return undefined
  }

  const { accessor } = context
  const { operation } = data

  const bodies = entries(getRequestBodyContent(data, context))

  const statements: Statement[] = [getOperationInputBaseTypeAst(data, context)]
  if (bodies.length > 1) {
    statements.push(getOperationInputUnionTypeAst(data, context))
  }
  return {
    path: accessor.path(operation, 'operation-input-type'),
    dependencies: getOperationInputTypeImports(data, context),
    content: statements,
  }
}
