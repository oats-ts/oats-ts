import { ParameterLocation } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getParameterSerializerFactoryName } from './getParameterSerializerFactoryName'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getParameterSerializerConstant } from './getParameterSerializerConstant'
import { collectSchemaImports } from './collectSchemaImports'

export const generateOperationParameterTypeSerializer =
  (location: ParameterLocation, target: OpenAPIGeneratorTarget, typeTarget: OpenAPIGeneratorTarget) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule => {
    const parameters = data[location]
    const { pathOf, dependenciesOf } = context
    if (parameters.length === 0) {
      return undefined
    }
    const path = pathOf(data.operation, target)

    return {
      path: path,
      dependencies: [
        getNamedImports(RuntimePackages.ParameterSerialization.name, [
          RuntimePackages.ParameterSerialization.serializers,
          getParameterSerializerFactoryName(location),
        ]),
        ...dependenciesOf(path, data.operation, typeTarget),
        ...collectSchemaImports(path, parameters, context),
      ],
      content: [getParameterSerializerConstant(location, data, context, target)],
    }
  }
