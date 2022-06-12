import { EnhancedOperation, hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, MethodSignature, ParameterDeclaration } from 'typescript'
import { documentNode } from '@oats-ts/typescript-common'
import { SdkGeneratorConfig } from '../utils/sdk/typings'

export function getSdkTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): MethodSignature {
  const { nameOf } = context

  const parameters: ParameterDeclaration[] = hasInput(data, context)
    ? [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          'request',
          undefined,
          factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/request-type')),
        ),
      ]
    : []

  const returnType = factory.createTypeReferenceNode('Promise', [
    factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/response-type')),
  ])

  const node = factory.createMethodSignature(
    [],
    nameOf(data.operation, 'openapi/operation'),
    undefined,
    [],
    parameters,
    returnType,
  )

  return config.documentation ? documentNode(node, data.operation) : node
}
