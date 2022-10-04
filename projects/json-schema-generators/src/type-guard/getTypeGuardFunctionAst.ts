import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, FunctionDeclaration, SyntaxKind } from 'typescript'
import { JsonSchemaGeneratorContext } from '../types'

export function getTypeGuardFunctionAst(
  schema: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  assertion: Expression,
): FunctionDeclaration {
  const paramName = assertion.kind === SyntaxKind.TrueKeyword ? '_' : 'input'
  return factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    context.nameOf(schema, 'oats/type-guard'),
    [],
    [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        paramName,
        undefined,
        factory.createTypeReferenceNode('any'),
      ),
    ],
    factory.createTypePredicateNode(undefined, paramName, context.referenceOf(schema, 'oats/type')),
    factory.createBlock([factory.createReturnStatement(assertion)]),
  )
}
