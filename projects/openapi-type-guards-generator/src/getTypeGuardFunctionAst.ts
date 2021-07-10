import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, FunctionDeclaration, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getTypeGuardFunctionAst(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  assertion: Expression,
): FunctionDeclaration {
  const { referenceOf, nameOf } = context
  return factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    nameOf(schema, 'openapi/type-guard'),
    [],
    [factory.createParameterDeclaration([], [], undefined, 'input', undefined, factory.createTypeReferenceNode('any'))],
    factory.createTypePredicateNode(undefined, 'input', referenceOf(schema, 'openapi/type')),
    factory.createBlock([factory.createReturnStatement(assertion)]),
  )
}
