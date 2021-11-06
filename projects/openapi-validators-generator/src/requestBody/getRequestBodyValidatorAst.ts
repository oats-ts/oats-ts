import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { getRequestBodyContent, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { entries } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getContentTypeBasedValidatorsAst } from '../getContentTypeBasedValidatorsAst'

export function getRequestBodyValidatorAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): Statement {
  const { nameOf } = context
  const { operation } = data

  const varName = nameOf(operation, 'openapi/request-body-validator')

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          varName,
          undefined,
          undefined,
          factory.createAsExpression(
            factory.createObjectLiteralExpression(
              getContentTypeBasedValidatorsAst(getRequestBodyContent(data, context), context),
            ),
            factory.createTypeReferenceNode('const'),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}