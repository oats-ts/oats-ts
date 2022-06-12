import { ParameterLocation } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getParameterTypeImports } from './getParameterTypeImports'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { factory, SourceFile, SyntaxKind } from 'typescript'
import { ParameterTypesGeneratorConfig } from './typings'
import { getParameterTypeLiteralAst } from './getParameterTypeLiteralAst'
import { createSourceFile } from '@oats-ts/typescript-common'

export const generateOperationParameterType =
  (location: ParameterLocation) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext, config: ParameterTypesGeneratorConfig): SourceFile => {
    const parameters = data[location]
    const { operation } = data
    const { pathOf, nameOf } = context

    return createSourceFile(
      pathOf(operation, getParameterTypeGeneratorTarget(location)),
      getParameterTypeImports(location, data, context),
      [
        factory.createTypeAliasDeclaration(
          [],
          [factory.createModifier(SyntaxKind.ExportKeyword)],
          nameOf(operation, getParameterTypeGeneratorTarget(location)),
          undefined,
          getParameterTypeLiteralAst(parameters, context, config),
        ),
      ],
    )
  }
