import { ParameterLocation } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext, RuntimePackages, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { factory, NodeFlags, SourceFile, SyntaxKind, VariableStatement } from 'typescript'
import { createSourceFile, getNamedImports } from '@oats-ts/typescript-common'
import { getParameterTypeGeneratorTarget } from '../parameters/getParameterTypeGeneratorTarget'
import { getDslObjectAst } from './getDslObjectAst'

const DslTypeMap: Record<ParameterLocation, string> = {
  cookie: RuntimePackages.ParameterSerialization.CookieDsl,
  header: RuntimePackages.ParameterSerialization.HeaderDsl,
  path: RuntimePackages.ParameterSerialization.PathDsl,
  query: RuntimePackages.ParameterSerialization.QueryDsl,
}

function createDeserializerConstant(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  target: OpenAPIGeneratorTarget,
): VariableStatement {
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          context.nameOf(data.operation, target),
          undefined,
          factory.createTypeReferenceNode(DslTypeMap[location], [
            context.referenceOf(data.operation, getParameterTypeGeneratorTarget(location)),
          ]),
          getDslObjectAst(data[location], context),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

export const createDslGenerator =
  (location: ParameterLocation, target: OpenAPIGeneratorTarget, typeTarget: OpenAPIGeneratorTarget) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): SourceFile => {
    const { pathOf, dependenciesOf } = context
    const path = pathOf(data.operation, target)
    return createSourceFile(
      path,
      [
        getNamedImports(RuntimePackages.ParameterSerialization.name, [
          RuntimePackages.ParameterSerialization.dsl,
          DslTypeMap[location],
        ]),
        ...dependenciesOf(path, data.operation, typeTarget),
      ],
      [createDeserializerConstant(location, data, context, target)],
    )
  }
