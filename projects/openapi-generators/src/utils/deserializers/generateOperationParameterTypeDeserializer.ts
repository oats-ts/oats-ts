import { ParameterLocation } from '@oats-ts/openapi-model'
import { getParameterDeserializerFactoryName } from './getParameterDeserializerFactoryName'
import { OpenAPIGeneratorContext, RuntimePackages, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { factory, NodeFlags, SourceFile, SyntaxKind, VariableStatement } from 'typescript'
import { createSourceFile, getNamedImports } from '@oats-ts/typescript-common'
import { getParameterDeserializerFactoryCallAst } from './getParameterDeserializerFactoryCallAst'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { collectDeserializerSchemaImports } from './collectParameterSchemaImports'

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
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): SourceFile => {
    const parameters = data[location]
    const { pathOf, dependenciesOf } = context

    const path = pathOf(data.operation, target)
    return createSourceFile(
      path,
      [
        getNamedImports(RuntimePackages.ParameterDeserialization.name, [
          RuntimePackages.ParameterDeserialization.deserializers,
          getParameterDeserializerFactoryName(location),
        ]),
        ...dependenciesOf(path, data.operation, typeTarget),
        ...collectDeserializerSchemaImports(path, parameters, context),
      ],
      [createDeserializerConstant(location, data, context, target)],
    )
  }
