import { EnhancedOperation, hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, MethodSignature, ParameterDeclaration, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import { SdkGeneratorConfig } from '../typings'

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
          'input',
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
