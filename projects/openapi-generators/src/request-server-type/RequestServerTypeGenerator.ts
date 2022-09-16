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

  protected shouldGenerate(operation: EnhancedOperation): boolean {
    return super.shouldGenerate(operation) || operation.cookie.length > 0
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Try.name, version }]
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
        const tryType = factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Try.Try), [
          wrappedType,
        ])
        return factory.createPropertySignature([], name, undefined, tryType)
      }
      case 'cookies': {
        const tryType = factory.createTypeReferenceNode(RuntimePackages.Try.Try, [
          factory.createTypeReferenceNode('Partial', [type]),
        ])
        return factory.createPropertySignature([], name, undefined, tryType)
      }
      default: {
        const tryType = factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Try.Try), [type])
        return factory.createPropertySignature([], name, undefined, tryType)
      }
    }
  }

  protected getImports(path: string, data: EnhancedOperation): ImportDeclaration[] {
    return [...super.getImports(path, data), getNamedImports(RuntimePackages.Try.name, [RuntimePackages.Try.Try])]
  }
}
