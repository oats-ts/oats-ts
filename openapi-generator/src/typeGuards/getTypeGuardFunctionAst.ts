import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, FunctionDeclaration } from 'typescript'
import { tsExportModifiers } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'

export function getTypeGuardFunctionAst(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  assertion: Expression,
): FunctionDeclaration {
  const { accessor } = context
  return factory.createFunctionDeclaration(
    [],
    tsExportModifiers(),
    undefined,
    accessor.name(schema, 'type-guard'),
    [],
    [factory.createParameterDeclaration([], [], undefined, 'input', undefined, factory.createTypeReferenceNode('any'))],
    factory.createTypePredicateNode(undefined, 'input', factory.createTypeReferenceNode(accessor.name(schema, 'type'))),
    factory.createBlock([factory.createReturnStatement(assertion)]),
  )
}
