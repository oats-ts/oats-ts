import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, FunctionDeclaration, SyntaxKind } from 'typescript'
import { TypeGuardGeneratorContext } from './typings'

export function getTypeGuardFunctionAst(
  schema: SchemaObject | ReferenceObject,
  context: TypeGuardGeneratorContext,
  assertion: Expression,
): FunctionDeclaration {
  const { referenceOf, nameOf } = context
  return factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    nameOf(schema, context.produces),
    [],
    [factory.createParameterDeclaration([], [], undefined, 'input', undefined, factory.createTypeReferenceNode('any'))],
    factory.createTypePredicateNode(undefined, 'input', referenceOf(schema, context.consumes)),
    factory.createBlock([factory.createReturnStatement(assertion)]),
  )
}
