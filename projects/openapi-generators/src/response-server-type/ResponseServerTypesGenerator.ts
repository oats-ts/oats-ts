import { values } from 'lodash'
import {
  EnhancedOperation,
  OpenAPIGeneratorTarget,
  EnhancedResponse,
  OpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { TypeNode, ImportDeclaration, factory, PropertySignature, SyntaxKind } from 'typescript'
import { getModelImports, getNamedImports, safeName } from '@oats-ts/typescript-common'
import { BaseResponseTypesGenerator, ResponsePropertyName } from '../utils/BaseResponseTypeGenerator'
import { packages } from '@oats-ts/model-common'

export class ResponseServerTypesGenerator extends BaseResponseTypesGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-server-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/response-headers-type', 'oats/cookies-type']
  }

  protected getImports(path: string, operation: EnhancedOperation, responses: EnhancedResponse[]): ImportDeclaration[] {
    return [
      ...super.getImports(path, operation, responses),
      ...(operation.cookie.length > 0
        ? [
            getNamedImports(packages.openApiHttp.name, [packages.openApiHttp.exports.Cookies]),
            ...getModelImports<OpenAPIGeneratorTarget>(path, 'oats/cookies-type', [operation.operation], this.context),
          ]
        : []),
    ]
  }

  protected createProperty(
    name: ResponsePropertyName,
    type: TypeNode,
    operation: EnhancedOperation,
    response: EnhancedResponse,
    context: OpenAPIGeneratorContext,
  ): PropertySignature {
    const propName = safeName(name)
    switch (name) {
      case 'cookies': {
        const isOptional = operation.cookie.every((cookie) => !cookie.required)
        return factory.createPropertySignature(
          undefined,
          propName,
          isOptional ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
          factory.createTypeReferenceNode(packages.openApiHttp.exports.Cookies, [type]),
        )
      }
      case 'headers': {
        const isOptional = values(response.headers)
          .map((header) => context.dereference(header, true))
          .every((header) => !header.required)
        return factory.createPropertySignature(
          undefined,
          propName,
          isOptional ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
          type,
        )
      }
      case 'body': {
        return factory.createPropertySignature(undefined, propName, undefined, type)
      }
      case 'mimeType': {
        return factory.createPropertySignature(undefined, propName, undefined, type)
      }
      case 'statusCode': {
        return factory.createPropertySignature(undefined, propName, undefined, type)
      }
    }
  }
}
