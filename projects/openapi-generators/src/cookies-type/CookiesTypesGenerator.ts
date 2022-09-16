import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { BaseParameterObject, ParameterObject } from '@oats-ts/openapi-model'
import { getNamedImports } from '@oats-ts/typescript-common'
import { ImportDeclaration, PropertySignature, TypeNode } from 'typescript'
import { InputParameterTypesGenerator } from '../utils/parameters/InputParameterTypesGenerator'

export class CookiesTypesGenerator extends InputParameterTypesGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cookies-type'
  }
  protected getParameterObjects(data: EnhancedOperation): ParameterObject[] {
    return data.cookie
  }
  // Makes each property optional
  protected createProperty(name: string, _: boolean, typeNode: TypeNode): PropertySignature {
    return super.createProperty(name, false, typeNode)
  }
  protected getImports(path: string, parameters: (BaseParameterObject | ParameterObject)[]): ImportDeclaration[] {
    return [
      ...super.getImports(path, parameters),
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.CookieValue]),
    ]
  }
}
