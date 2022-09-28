import { ParameterObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { TypeNode, factory, PropertySignature, ImportDeclaration } from 'typescript'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { BaseRequestTypesGenerator, RequestPropertyName } from '../utils/request/BaseRequestTypesGenerator'
import { getNamedImports } from '@oats-ts/typescript-common'

export class RequestServerTypesGenerator extends BaseRequestTypesGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-server-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/request-headers-type', 'oats/query-type', 'oats/path-type', 'oats/cookies-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Try.name, version }]
  }

  protected includeCookie(): boolean {
    return true
  }

  protected createRequestProperty(
    name: RequestPropertyName,
    type: TypeNode,
    parameters: ParameterObject[],
    operation: EnhancedOperation,
  ): PropertySignature {
    switch (name) {
      case 'body': {
        const body = this.context.dereference(operation.operation.requestBody)
        const wrappedType = body?.required
          ? type
          : factory.createUnionTypeNode([type, factory.createTypeReferenceNode('undefined')])
        const tryType = factory.createTypeReferenceNode(RuntimePackages.Try.Try, [wrappedType])
        return factory.createPropertySignature([], name, undefined, tryType)
      }
      case 'cookies': {
        const tryType = factory.createTypeReferenceNode(RuntimePackages.Try.Try, [type])
        return factory.createPropertySignature([], name, undefined, tryType)
      }
      default: {
        const tryType = factory.createTypeReferenceNode(RuntimePackages.Try.Try, [type])
        return factory.createPropertySignature([], name, undefined, tryType)
      }
    }
  }

  protected getImports(path: string, data: EnhancedOperation): ImportDeclaration[] {
    return [...super.getImports(path, data), getNamedImports(RuntimePackages.Try.name, [RuntimePackages.Try.Try])]
  }
}
