import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, FunctionDeclaration, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getTypeGuardFunctionAst(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  assertion: Expression,
): FunctionDeclaration {
  const { accessor } = context
  return factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    accessor.name(schema, 'openapi/type-guard'),
    [],
    [factory.createParameterDeclaration([], [], undefined, 'input', undefined, factory.createTypeReferenceNode('any'))],
    factory.createTypePredicateNode(undefined, 'input', accessor.reference(schema, 'openapi/type')),
    factory.createBlock([factory.createReturnStatement(assertion)]),
  )
}
