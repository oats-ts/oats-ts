import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { entries, isNil, negate } from 'lodash'
import { Statement } from 'typescript'
import { getReferencedNamedSchemas } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getOperationInputBaseTypeAst } from './getOperationInputBaseTypeAst'
import { getOperationInputUnionTypeAst } from './getOperationInputUnionTypeAst'
import { getRequestBodyContent } from './getRequestBodyContent'
import { isOperationInputTypeRequired } from './isOperationInputTypeRequired'
import { getModelImports } from '@oats-ts/typescript-common'

export function generateOperationInputType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  if (!isOperationInputTypeRequired(data, context)) {
    return undefined
  }

  const { accessor } = context
  const { operation } = data

  const bodies = entries(getRequestBodyContent(data, context))
  const referencedTypes = getReferencedNamedSchemas(
    { oneOf: bodies.map(([, { schema }]) => schema).filter(negate(isNil)) },
    context,
  )
  const path = accessor.path(operation, 'operation-input-type')

  const statements: Statement[] = [getOperationInputBaseTypeAst(data, context)]
  if (bodies.length > 1) {
    statements.push(getOperationInputUnionTypeAst(data, context))
  }
  return {
    path,
    dependencies: getModelImports(path, 'type', referencedTypes, context),
    content: statements,
  }
}
