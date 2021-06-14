import { Statement } from '@babel/types'
import { BabelModule } from '@oats-ts/babel-writer'
import { entries, isNil, negate } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { getImportDeclarations } from '../../common/getImportDeclarations'
import { getReferencedNamedSchemas } from '../../common/getReferencedNamedSchemas'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getOperationInputBaseTypeAst } from './getOperationInputBaseTypeAst'
import { getOperationInputUnionTypeAst } from './getOperationInputUnionTypeAst'
import { getRequestBodyContent } from './getRequestBodyContent'
import { isOperationInputTypeRequired } from './isOperationInputTypeRequired'

export function generateOperationInputType(data: EnhancedOperation, context: OpenAPIGeneratorContext): BabelModule {
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
    imports: getImportDeclarations(path, 'type', referencedTypes, context),
    path,
    statements,
  }
}
