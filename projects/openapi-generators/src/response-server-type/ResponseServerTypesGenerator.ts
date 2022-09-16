import { values } from 'lodash'
import {
  EnhancedOperation,
  OpenAPIGeneratorTarget,
  EnhancedResponse,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { TypeNode, ImportDeclaration, factory, PropertySignature, SyntaxKind } from 'typescript'
import { getNamedImports, safeName } from '@oats-ts/typescript-common'
import { BaseResponseTypesGenerator, ResponsePropertyName } from '../utils/response/BaseResponseTypeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'

export class ResponseServerTypesGenerator extends BaseResponseTypesGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-server-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/response-headers-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [...super.runtimeDependencies(), { name: RuntimePackages.Try.name, version }]
  }

  protected getImports(path: string, operation: EnhancedOperation, responses: EnhancedResponse[]): ImportDeclaration[] {
    return [
      ...super.getImports(path, operation, responses),
      getNamedImports(RuntimePackages.Try.name, [RuntimePackages.Try.Try]),
      ...(operation.cookie.length > 0
        ? [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.CookieValue])]
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
          factory.createTypeReferenceNode(RuntimePackages.Http.Cookies, [type]),
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
