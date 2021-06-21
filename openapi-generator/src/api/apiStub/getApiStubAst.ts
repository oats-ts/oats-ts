import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiStubMethodAst } from './getApiStubMethodAst'
import { ClassDeclaration, factory, SyntaxKind } from 'typescript'
import { tsExportModifier, tsProtectedModifier } from '../../common/typeScriptUtils'
import { ApiGeneratorConfig } from '../typings'

export function getApiStubAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): ClassDeclaration {
  const { accessor } = context

  const fallback = factory.createMethodDeclaration(
    [],
    [tsProtectedModifier()],
    undefined,
    'fallback',
    undefined,
    [],
    [],
    factory.createTypeReferenceNode('never'),
    factory.createBlock([
      factory.createThrowStatement(
        factory.createNewExpression(
          factory.createIdentifier('Error'),
          [],
          [factory.createStringLiteral('Not implemented.')],
        ),
      ),
    ]),
  )

  const heritageClauses = config.type
    ? [
        factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
          factory.createExpressionWithTypeArguments(factory.createIdentifier(accessor.name(document, 'api-type')), []),
        ]),
      ]
    : []

  return factory.createClassDeclaration(
    [],
    [tsExportModifier()],
    accessor.name(document, 'api-stub'),
    [],
    heritageClauses,
    [fallback, ...operations.map((operation) => getApiStubMethodAst(operation, context))],
  )
}
