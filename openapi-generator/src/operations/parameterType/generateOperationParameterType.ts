import { ParameterLocation } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '../../../../babel-writer/lib'
import { getRighthandSideTypeAst } from '../../types/getRighthandSideTypeAst'
import { EnhancedOperation } from '../typings'
import { getParameterTypeImports } from './getParameterTypeImports'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { getParameterSchemaObject } from './getParameterSchemaObject'
import { factory } from 'typescript'
import { tsExportModifier } from '../../common/typeScriptUtils'

const generateOperationParameterType =
  (location: ParameterLocation) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule => {
    const parameters = data[location]
    const { operation } = data
    const { accessor } = context

    if (parameters.length === 0) {
      return undefined
    }

    return {
      imports: getParameterTypeImports(location, data, context),
      path: accessor.path(operation, getParameterTypeGeneratorTarget(location)),
      statements: [
        factory.createTypeAliasDeclaration(
          [],
          [tsExportModifier()],
          accessor.name(operation, getParameterTypeGeneratorTarget(location)),
          undefined,
          getRighthandSideTypeAst(getParameterSchemaObject(parameters), context),
        ),
      ],
    }
  }

export const generateQueryParametersType = generateOperationParameterType('query')
export const generatePathParametersType = generateOperationParameterType('path')
export const generateHeaderParametersType = generateOperationParameterType('header')
