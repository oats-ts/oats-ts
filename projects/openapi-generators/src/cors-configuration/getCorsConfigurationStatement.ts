import {
  EnhancedPathItem,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { getCorsEnabledPaths } from './getCorsEnabledPaths'
import { getCorsExpression } from './getCorsExpression'
import { CorsConfigurationGeneratorConfig } from './typings'

const target: OpenAPIGeneratorTarget = 'oats/cors-configuration'

const warningLabel = `WARNING: No allowed origins for any operations, generator "${target}" likely needs to be configured!

- If you don't need CORS, remove "${target}" from your configuration.
- If you need CORS, please provide at least the getAllowedOrigins options for "${target}".
- More info on CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- More info on configuring generators: https://oats-ts.github.io/docs/#/docs/OpenAPI_Generate`

export function getCorsConfigurationStatement(
  _paths: EnhancedPathItem[],
  context: OpenAPIGeneratorContext,
  config: CorsConfigurationGeneratorConfig,
): Statement {
  const paths = getCorsEnabledPaths(_paths, config)
  const statement = factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          context.nameOf(context.document, 'oats/cors-configuration'),
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Http.CorsConfiguration),
          getCorsExpression(paths, context, config),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  return paths.length === 0 ? documentNode(statement, { description: warningLabel }) : statement
}
