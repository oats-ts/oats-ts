import { EnhancedOperation, EnhancedResponse, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'
import { BaseResponseTypesGenerator } from '../utils/BaseResponseTypeGenerator'
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

  protected needsCookiesProperty(operation: EnhancedOperation): boolean {
    return this.getItems().some((item) => item.cookie.length > 0) && this.configuration().cookies
  }

  protected getImports(path: string, operation: EnhancedOperation, responses: EnhancedResponse[]): ImportDeclaration[] {
    return [
      ...super.getImports(path, operation, responses),
      ...(this.needsCookiesProperty(operation)
        ? [getNamedImports(this.httpPkg.name, [this.httpPkg.imports.SetCookieValue])]
        : []),
    ]
  }
}
