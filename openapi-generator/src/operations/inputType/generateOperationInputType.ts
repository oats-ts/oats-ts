import { BabelModule, TypeScriptModule } from '@oats-ts/babel-writer'
import { entries, isNil, negate } from 'lodash'
import { Statement } from 'typescript'
import { getImportDeclarations } from '../../common/getImportDeclarations'
import { getReferencedNamedSchemas } from '../../common/getReferencedNamedSchemas'
import { tsModelImportAsts } from '../../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getOperationInputBaseTypeAst } from './getOperationInputBaseTypeAst'
import { getOperationInputUnionTypeAst } from './getOperationInputUnionTypeAst'
import { getRequestBodyContent } from './getRequestBodyContent'
import { isOperationInputTypeRequired } from './isOperationInputTypeRequired'

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
    imports: tsModelImportAsts(path, 'type', referencedTypes, context),
    path,
    statements,
  }
}
