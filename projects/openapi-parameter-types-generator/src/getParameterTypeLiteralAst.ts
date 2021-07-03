import { ParameterObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterTypesGeneratorConfig } from './typings'
import { factory, SyntaxKind, TypeLiteralNode } from 'typescript'
import { documentNode, safeName } from '@oats-ts/typescript-common'

export function getParameterTypeLiteralAst(
  parameters: ParameterObject[],
  context: OpenAPIGeneratorContext,
  config: ParameterTypesGeneratorConfig,
): TypeLiteralNode {
  const { accessor } = context
  return factory.createTypeLiteralNode(
    parameters.map((parameter) => {
      const node = factory.createPropertySignature(
        undefined,
        safeName(parameter.name),
        parameter.required ? undefined : factory.createToken(SyntaxKind.QuestionToken),
        accessor.reference(parameter.schema, 'openapi/type'),
      )
      return config.documentation ? documentNode(node, parameter) : node
    }),
  )
}
