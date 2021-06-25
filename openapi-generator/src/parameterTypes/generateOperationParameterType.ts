import { ParameterLocation } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '../operations/typings'
import { getParameterTypeImports } from './getParameterTypeImports'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { factory } from 'typescript'
import { tsExportModifier } from '../common/typeScriptUtils'
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
          [tsExportModifier()],
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
