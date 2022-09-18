import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, MethodSignature, ParameterDeclaration } from 'typescript'
import { documentNode } from '@oats-ts/typescript-common'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { getSdkMethodParameterAsts } from '../utils/sdk/getSdkMethodParameterAsts'

export function getSdkTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): MethodSignature {
  const parameters: ParameterDeclaration[] = getSdkMethodParameterAsts(data, context, config)

  const returnType = factory.createTypeReferenceNode('Promise', [
    factory.createTypeReferenceNode(context.nameOf(data.operation, 'oats/response-type')),
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
