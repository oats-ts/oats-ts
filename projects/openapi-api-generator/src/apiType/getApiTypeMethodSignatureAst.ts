import { EnhancedOperation, hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, MethodSignature, ParameterDeclaration, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { ApiGeneratorConfig } from '../typings'
import { documentNode } from '@oats-ts/typescript-common'

export function getApiTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): MethodSignature {
  const { accessor } = context

  const parameters: ParameterDeclaration[] = []

  if (hasInput(data, context)) {
    parameters.push(
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'input',
        undefined,
        factory.createTypeReferenceNode(accessor.name(data.operation, 'operation-input-type')),
      ),
    )
  }

  parameters.push(
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      'config',
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode('Partial', [factory.createTypeReferenceNode(RuntimePackages.Http.RequestConfig)]),
    ),
  )

  const returnType = factory.createTypeReferenceNode('Promise', [
    factory.createTypeReferenceNode(accessor.name(data.operation, 'operation-response-type')),
  ])

  const node = factory.createMethodSignature(
    [],
    accessor.name(data.operation, 'operation'),
    undefined,
    [],
    parameters,
    returnType,
  )

  return config.documentation ? documentNode(node, data.operation) : node
}