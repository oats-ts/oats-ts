import { ParameterLocation } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { getParameterSerializerFactoryName } from './getParameterSerializerFactoryName'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { createSourceFile, getNamedImports } from '@oats-ts/typescript-common'
import { getParameterSerializerConstant } from './getParameterSerializerConstant'
import { collectSchemaImports } from './collectSchemaImports'
import { SourceFile } from 'typescript'

export const generateOperationParameterTypeSerializer =
  (location: ParameterLocation, target: OpenAPIGeneratorTarget, typeTarget: OpenAPIGeneratorTarget) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): SourceFile => {
    const parameters = data[location]
    const { pathOf, dependenciesOf } = context
    const path = pathOf(data.operation, target)
    return createSourceFile(
      path,
      [
        getNamedImports(RuntimePackages.ParameterSerialization.name, [
          RuntimePackages.ParameterSerialization.serializers,
          getParameterSerializerFactoryName(location),
        ]),
        ...dependenciesOf(path, data.operation, typeTarget),
        ...collectSchemaImports(path, parameters, context),
      ],
      [getParameterSerializerConstant(location, data, context, target)],
    )
  }
