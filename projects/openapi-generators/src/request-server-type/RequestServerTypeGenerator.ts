import { ParameterObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { TypeNode, factory, PropertySignature } from 'typescript'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { BaseRequestTypesGenerator, RequestPropertyName } from '../utils/request/BaseRequestTypesGenerator'

export class RequestServerTypesGenerator extends BaseRequestTypesGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-server-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/request-headers-type', 'oats/query-type', 'oats/path-type']
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
      default: {
        const tryType = factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Try.Try), [type])
        return factory.createPropertySignature([], name, undefined, tryType)
      }
    }
  }
}
