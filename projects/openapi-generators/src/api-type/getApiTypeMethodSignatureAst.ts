import { EnhancedOperation, hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, MethodSignature, ParameterDeclaration } from 'typescript'
import { documentNode } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorConfig } from './typings'

export function getApiTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ApiTypeGeneratorConfig,
): MethodSignature {
  const parameters: ParameterDeclaration[] = hasInput(data, context, true)
    ? [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          'request',
          undefined,
          context.referenceOf(data.operation, 'oats/request-server-type'),
        ),
      ]
    : []

  const returnType = factory.createTypeReferenceNode('Promise', [
    factory.createTypeReferenceNode(context.nameOf(data.operation, 'oats/response-server-type')),
  ])

  const node = factory.createMethodSignature(
    [],
    context.nameOf(data.operation, 'oats/operation'),
    undefined,
    [],
    parameters,
    returnType,
  )

  return config.documentation ? documentNode(node, data.operation) : node
}
