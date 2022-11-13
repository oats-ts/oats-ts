import { EnhancedOperation, OpenAPIGeneratorTarget, EnhancedResponse } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'
import { BaseResponseTypesGenerator } from '../utils/BaseResponseTypeGenerator'

export class ResponseServerTypesGenerator extends BaseResponseTypesGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-server-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/response-headers-type', 'oats/cookies-type']
  }

  protected shouldAimForOptional(): boolean {
    return true
  }

  protected needsCookiesProperty(): boolean {
    return this.getItems().some((item) => item.cookie.length > 0)
  }

  protected getImports(path: string, operation: EnhancedOperation, responses: EnhancedResponse[]): ImportDeclaration[] {
    return [
      ...super.getImports(path, operation, responses),
      ...(operation.cookie.length > 0
        ? [getNamedImports(this.httpPkg.name, [this.httpPkg.imports.SetCookieValue])]
        : []),
    ]
  }
}
