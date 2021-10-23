import { EnhancedOperation, hasRequestBody, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isEmpty } from 'lodash'
import { factory, NodeFlags } from 'typescript'
import { Names } from './names'

export function getIssuesStatementAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.issues),
          undefined,
          undefined,
          factory.createArrayLiteralExpression(
            [
              ...(!isEmpty(data.path) ? [factory.createSpreadElement(factory.createIdentifier(Names.pathIssues))] : []),
              ...(!isEmpty(data.query)
                ? [factory.createSpreadElement(factory.createIdentifier(Names.queryIssues))]
                : []),
              ...(!isEmpty(data.header)
                ? [factory.createSpreadElement(factory.createIdentifier(Names.headerIssues))]
                : []),
              ...(hasRequestBody(data, context)
                ? [factory.createSpreadElement(factory.createIdentifier(Names.bodyIssues))]
                : []),
            ],
            false,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
