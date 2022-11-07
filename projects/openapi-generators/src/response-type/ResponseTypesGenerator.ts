import { EnhancedOperation, EnhancedResponse, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { TypeNode, factory, PropertySignature, SyntaxKind, ImportDeclaration } from 'typescript'
import { getModelImports, getNamedImports, safeName } from '@oats-ts/typescript-common'
import { BaseResponseTypesGenerator, ResponsePropertyName } from '../utils/BaseResponseTypeGenerator'
import { ResponseTypesGeneratorConfig } from './typings'

export class ResponseTypesGenerator extends BaseResponseTypesGenerator<ResponseTypesGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return [
      'oats/type',
      'oats/response-headers-type',
      ...(this.configuration().cookies ? (['oats/cookies-type'] as OpenAPIGeneratorTarget[]) : []),
    ]
  }

  protected getImports(path: string, operation: EnhancedOperation, responses: EnhancedResponse[]): ImportDeclaration[] {
    return [
      ...super.getImports(path, operation, responses),
      ...(operation.cookie.length > 0 && this.configuration().cookies
        ? [
            getNamedImports(this.httpPkg.name, [this.httpPkg.imports.Cookies]),
            ...getModelImports<OpenAPIGeneratorTarget>(path, 'oats/cookies-type', [operation.operation], this.context()),
          ]
        : []),
    ]
  }

  protected createProperty(name: ResponsePropertyName, type: TypeNode): PropertySignature | undefined {
    const propName = safeName(name)
    switch (name) {
      case 'cookies': {
        if (!this.configuration().cookies) {
          return undefined
        }
        return factory.createPropertySignature(
          undefined,
          propName,
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode(this.httpPkg.exports.Cookies, [type]),
        )
      }
      case 'body': {
        return factory.createPropertySignature(undefined, propName, undefined, type)
      }
      case 'headers': {
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
