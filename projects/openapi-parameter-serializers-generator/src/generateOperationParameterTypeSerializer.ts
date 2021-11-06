import { ParameterLocation } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getParameterSerializerFactoryName } from './getParameterSerializerFactoryName'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { getParameterSerializerConstant } from './getParameterSerializerConstant'

export const generateOperationParameterTypeSerializer =
  (location: ParameterLocation, target: OpenAPIGeneratorTarget, typeTarget: OpenAPIGeneratorTarget) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule => {
    const parameters = data[location]
    const { pathOf, dependenciesOf } = context
    if (parameters.length === 0) {
      return undefined
    }
    const serializerPath = pathOf(data.operation, target)
    return {
      path: serializerPath,
      dependencies: [
        getNamedImports(RuntimePackages.ParameterSerialization.name, [
          RuntimePackages.ParameterSerialization.serializers,
          getParameterSerializerFactoryName(location),
        ]),
        ...dependenciesOf(serializerPath, data.operation, typeTarget),
      ],
      content: [getParameterSerializerConstant(location, data, context, target)],
    }
  }
