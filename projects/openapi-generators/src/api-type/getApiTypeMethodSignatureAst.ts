import { EnhancedOperation, hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, MethodSignature, ParameterDeclaration } from 'typescript'
import { documentNode } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorConfig } from './typings'

export function getApiTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ApiTypeGeneratorConfig,
): MethodSignature {
  const { nameOf, referenceOf } = context

  const parameters: ParameterDeclaration[] = hasInput(data, context)
    ? [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          'request',
          undefined,
          referenceOf(data.operation, 'oats/request-server-type'),
        ),
      ]
    : []

  const returnType = factory.createTypeReferenceNode('Promise', [
    factory.createTypeReferenceNode(nameOf(data.operation, 'oats/response-type')),
  ])

  const node = factory.createMethodSignature(
    [],
    nameOf(data.operation, 'oats/operation'),
    undefined,
    [],
    parameters,
    returnType,
  )

  return config.documentation ? documentNode(node, data.operation) : node
}
