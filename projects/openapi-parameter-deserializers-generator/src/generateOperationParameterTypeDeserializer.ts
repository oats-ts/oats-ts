import { ParameterLocation } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getParameterDeserializerFactoryName } from './getParameterDeserializerFactoryName'
import { OpenAPIGeneratorContext, RuntimePackages, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { factory, NodeFlags, SyntaxKind, VariableStatement } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getParameterDeserializerFactoryCallAst } from './getParameterDeserializerFactoryCallAst'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { flatMap, isNil, negate } from 'lodash'
import { collectEnumSchemas } from './collectEnumSchemas'

function createDeserializerConstant(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  target: OpenAPIGeneratorTarget,
): VariableStatement {
  const { nameOf, referenceOf } = context
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(data.operation, target),
          undefined,
          undefined,
          getParameterDeserializerFactoryCallAst(
            location,
            data,
            data[location],
            referenceOf(data.operation, getParameterTypeGeneratorTarget(location)),
            context,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

export const generateOperationParameterTypeDeserializer =
  (location: ParameterLocation, target: OpenAPIGeneratorTarget, typeTarget: OpenAPIGeneratorTarget) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule => {
    const parameters = data[location]
    const { pathOf, dependenciesOf, dereference } = context
    if (parameters.length === 0) {
      return undefined
    }
    const schemas = flatMap(
      parameters
        .map((parameter) => dereference(parameter, true))
        .map((parameter) => parameter?.schema)
        .filter(negate(isNil)),
      (schema) => collectEnumSchemas(schema, context),
    )
    const path = pathOf(data.operation, target)
    return {
      path,
      dependencies: [
        getNamedImports(RuntimePackages.ParameterDeserialization.name, [
          RuntimePackages.ParameterDeserialization.deserializers,
          getParameterDeserializerFactoryName(location),
        ]),
        ...dependenciesOf(path, data.operation, typeTarget),
        ...flatMap(schemas, (schema) => dependenciesOf(path, schema, 'openapi/type')),
      ],
      content: [createDeserializerConstant(location, data, context, target)],
    }
  }

export const generateQueryParameterTypeDeserializer = generateOperationParameterTypeDeserializer(
  'query',
  'openapi/query-deserializer',
  'openapi/query-type',
)
export const generatePathParameterTypeDeserializer = generateOperationParameterTypeDeserializer(
  'path',
  'openapi/path-deserializer',
  'openapi/path-type',
)
export const generateHeaderParameterTypeDeserializer = generateOperationParameterTypeDeserializer(
  'header',
  'openapi/request-headers-deserializer',
  'openapi/request-headers-type',
)
