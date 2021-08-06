import { ParameterLocation } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getParameterTypeImports } from './getParameterTypeImports'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { factory, SyntaxKind } from 'typescript'
import { ParameterTypesGeneratorConfig } from './typings'
import { getParameterTypeLiteralAst } from './getParameterTypeLiteralAst'

const generateOperationParameterType =
  (location: ParameterLocation) =>
  (
    data: EnhancedOperation,
    context: OpenAPIGeneratorContext,
    config: ParameterTypesGeneratorConfig,
  ): TypeScriptModule => {
    const parameters = data[location]
    const { operation } = data
    const { pathOf, nameOf } = context

    if (parameters.length === 0) {
      return undefined
    }

    return {
      path: pathOf(operation, getParameterTypeGeneratorTarget(location)),
      dependencies: getParameterTypeImports(location, data, context),
      content: [
        factory.createTypeAliasDeclaration(
          [],
          [factory.createModifier(SyntaxKind.ExportKeyword)],
          nameOf(operation, getParameterTypeGeneratorTarget(location)),
          undefined,
          getParameterTypeLiteralAst(parameters, context, config),
        ),
      ],
    }
  }

export const generateQueryParametersType = generateOperationParameterType('query')
export const generatePathParametersType = generateOperationParameterType('path')
export const generateHeaderParametersType = generateOperationParameterType('header')
