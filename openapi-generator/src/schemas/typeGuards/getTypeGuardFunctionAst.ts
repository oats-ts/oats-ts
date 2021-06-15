import {
  blockStatement,
  exportNamedDeclaration,
  functionDeclaration,
  identifier,
  tsAnyKeyword,
  tsTypeAnnotation,
  tsTypePredicate,
  tsTypeReference,
  returnStatement,
  Expression,
} from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { typedIdAst } from '../../common/babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { getShallowTypeAssertionAst } from './getShallowTypeAssertionAst'

export function getTypeGuardFunctionAst(schema: SchemaObject, context: OpenAPIGeneratorContext, assertion: Expression) {
  const { accessor } = context

  const fn = functionDeclaration(
    identifier(accessor.name(schema, 'type-guard')),
    [typedIdAst('input', tsAnyKeyword())],
    blockStatement([returnStatement(assertion)]),
  )

  fn.returnType = tsTypeAnnotation(
    tsTypePredicate(identifier('input'), tsTypeAnnotation(tsTypeReference(identifier(accessor.name(schema, 'type'))))),
  )

  return exportNamedDeclaration(fn)
}
