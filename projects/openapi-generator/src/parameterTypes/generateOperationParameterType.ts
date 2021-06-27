import { ParameterLocation } from 'openapi3-ts'
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
    const { accessor } = context

    if (parameters.length === 0) {
      return undefined
    }

    return {
      path: accessor.path(operation, getParameterTypeGeneratorTarget(location)),
      dependencies: getParameterTypeImports(location, data, context),
      content: [
        factory.createTypeAliasDeclaration(
          [],
          [factory.createModifier(SyntaxKind.ExportKeyword)],
          accessor.name(operation, getParameterTypeGeneratorTarget(location)),
          undefined,
          getParameterTypeLiteralAst(parameters, context, config),
        ),
      ],
    }
  }

export const generateQueryParametersType = generateOperationParameterType('query')
export const generatePathParametersType = generateOperationParameterType('path')
export const generateHeaderParametersType = generateOperationParameterType('header')
