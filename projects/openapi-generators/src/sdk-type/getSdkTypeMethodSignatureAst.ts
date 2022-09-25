import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, MethodSignature, ParameterDeclaration, TypeReferenceNode } from 'typescript'
import { documentNode } from '@oats-ts/typescript-common'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { getSdkMethodParameterAsts } from '../utils/sdk/getSdkMethodParameterAsts'
import { isNil } from 'lodash'

export function getSdkTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): MethodSignature {
  const parameters: ParameterDeclaration[] = getSdkMethodParameterAsts(data, context)

  const responseType = context.referenceOf<TypeReferenceNode>(data.operation, 'oats/response-type')

  const returnPromiseType = factory.createTypeReferenceNode('Promise', [
    isNil(responseType) ? factory.createTypeReferenceNode('void') : responseType,
  ])

  const node = factory.createMethodSignature(
    [],
    context.nameOf(data.operation, 'oats/operation'),
    undefined,
    [],
    parameters,
    returnPromiseType,
  )

  return config.documentation ? documentNode(node, data.operation) : node
}
