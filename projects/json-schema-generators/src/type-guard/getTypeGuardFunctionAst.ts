import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, FunctionDeclaration, SyntaxKind } from 'typescript'

export function getTypeGuardFunctionAst(
  schema: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  assertion: Expression,
): FunctionDeclaration {
  const { referenceOf, nameOf } = context
  const paramName = assertion.kind === SyntaxKind.TrueKeyword ? '_' : 'input'
  return factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    nameOf(schema, 'json-schema/type-guard'),
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
    factory.createTypePredicateNode(undefined, paramName, referenceOf(schema, 'json-schema/type')),
    factory.createBlock([factory.createReturnStatement(assertion)]),
  )
}
