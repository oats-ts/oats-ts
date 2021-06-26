import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, FunctionDeclaration, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'

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
    accessor.name(schema, 'type-guard'),
    [],
    [factory.createParameterDeclaration([], [], undefined, 'input', undefined, factory.createTypeReferenceNode('any'))],
    factory.createTypePredicateNode(undefined, 'input', factory.createTypeReferenceNode(accessor.name(schema, 'type'))),
    factory.createBlock([factory.createReturnStatement(assertion)]),
  )
}
