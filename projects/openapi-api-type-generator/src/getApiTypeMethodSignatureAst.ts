import { EnhancedOperation, hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, MethodSignature, ParameterDeclaration, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorConfig } from './typings'

export function getSdkTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ApiTypeGeneratorConfig,
): MethodSignature {
  const { nameOf } = context

  const parameters: ParameterDeclaration[] = []

  if (hasInput(data, context)) {
    parameters.push(
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'input',
        undefined,
        factory.createUnionTypeNode([
          factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/request-type')),
          factory.createTypeReferenceNode('ParameterIssues'),
        ]),
      ),
    )
  }

  parameters.push(
    factory.createParameterDeclaration([], [], undefined, 'extra', undefined, factory.createTypeReferenceNode('T')),
  )

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
