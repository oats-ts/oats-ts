import { factory, ParameterDeclaration } from 'typescript'
import { hasInput } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from './typings'

export function getSdkMethodParameterAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): ParameterDeclaration[] {
  const { nameOf } = context

  return hasInput(data, context, config.cookies)
    ? [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          'request',
          undefined,
          factory.createTypeReferenceNode(nameOf(data.operation, 'oats/request-type')),
        ),
      ]
    : []
}
