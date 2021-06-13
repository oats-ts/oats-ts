import { exportNamedDeclaration, identifier, tsTypeAliasDeclaration, TSType, tsTypeReference } from '@babel/types'
import { ParameterLocation } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { getRighthandSideTypeAst } from '../../schemas/types/getRighthandSideTypeAst'
import { EnhancedOperation } from '../typings'
import { getParameterTypeImports } from './getParameterTypeImports'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { getParameterSchemaObject } from './getParameterSchemaObject'

export function generateOperationParameterType(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): BabelModule {
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
      exportNamedDeclaration(
        tsTypeAliasDeclaration(
          identifier(accessor.name(operation, getParameterTypeGeneratorTarget(location))),
          undefined,
          getRighthandSideTypeAst(getParameterSchemaObject(parameters), context),
        ),
      ),
    ],
  }
}
