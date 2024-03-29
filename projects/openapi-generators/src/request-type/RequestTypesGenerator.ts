import { ParameterObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { TypeNode, factory, PropertySignature, SyntaxKind } from 'typescript'
import { BaseRequestTypesGenerator, RequestPropertyName } from '../utils/BaseRequestTypesGenerator'
import { RequestTypesGeneratorConfig } from './typings'

export class RequestTypesGenerator extends BaseRequestTypesGenerator<RequestTypesGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return [
      'oats/type',
      'oats/request-headers-type',
      'oats/query-type',
      'oats/path-type',
      ...(this.configuration().cookies ? (['oats/cookies-type'] as OpenAPIGeneratorTarget[]) : []),
    ]
  }

  protected includeCookie(): boolean {
    return Boolean(this.configuration().cookies)
  }

  protected createRequestProperty(
    name: RequestPropertyName,
    type: TypeNode,
    parameters: ParameterObject[],
    operation: EnhancedOperation,
  ): PropertySignature {
    switch (name) {
      case 'body': {
        const body = this.context().dereference(operation.operation.requestBody)
        return factory.createPropertySignature(
          [],
          name,
          body?.required ? undefined : factory.createToken(SyntaxKind.QuestionToken),
          type,
        )
      }
      default: {
        const isOptional = parameters.length === 0 || parameters.every((param) => !Boolean(param.required))
        return factory.createPropertySignature(
          [],
          name,
          isOptional ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
          type,
        )
      }
    }
  }
}
