import { OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, NodeFlags, Statement } from 'typescript'
import { RouterNames } from './RouterNames'

export function getAdapterStatement(context: OpenAPIGeneratorContext): Statement {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.adapter),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.ServerAdapter), [
            factory.createTypeReferenceNode(
              factory.createIdentifier(RuntimePackages.HttpServerExpress.ExpressToolkit),
              undefined,
            ),
          ]),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(RouterNames.response),
              factory.createIdentifier(RouterNames.locals),
            ),
            factory.createStringLiteral(RouterNames.adapterKey(context.hashOf(context.document))),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
