import { HeaderObject, ParameterObject } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterTypesGeneratorConfig } from './typings'
import { factory, SyntaxKind, TypeLiteralNode } from 'typescript'
import { documentNode, safeName } from '@oats-ts/typescript-common'

export function getParameterTypeLiteralAst(
  parameters: (ParameterObject | HeaderObject)[],
  context: OpenAPIGeneratorContext,
  config: ParameterTypesGeneratorConfig,
): TypeLiteralNode {
  const { referenceOf, nameOf } = context
  return factory.createTypeLiteralNode(
    parameters.map((parameter) => {
      const name = (parameter as ParameterObject).name ?? nameOf(parameter)
      const node = factory.createPropertySignature(
        undefined,
        safeName(name),
        parameter.required ? undefined : factory.createToken(SyntaxKind.QuestionToken),
        referenceOf(parameter.schema, 'oats/type'),
      )
      return config.documentation ? documentNode(node, parameter) : node
    }),
  )
}
