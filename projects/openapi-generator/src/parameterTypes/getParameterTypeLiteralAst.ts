import { ParameterObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterTypesGeneratorConfig } from './typings'
import { factory, TypeLiteralNode } from 'typescript'
import { getObjectPropertyAst } from '../types/getObjectPropertyAst'
import { documentParameter } from '../common/jsDoc'

export function getParameterTypeLiteralAst(
  parameters: ParameterObject[],
  context: OpenAPIGeneratorContext,
  config: ParameterTypesGeneratorConfig,
): TypeLiteralNode {
  return factory.createTypeLiteralNode(
    parameters.map((parameter) => {
      const ast = getObjectPropertyAst(parameter.name, !parameter.required, parameter.schema, context, {
        enums: false,
        documentation: false,
      })
      return documentParameter(ast, parameter, config)
    }),
  )
}
