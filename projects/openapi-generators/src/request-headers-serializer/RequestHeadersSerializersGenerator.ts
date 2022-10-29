import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class RequestHeadersSerializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-headers-serializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/request-headers-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/request-headers-type'
  }
  protected getFactoryFunctionName(): string {
    return this.paramsPkg.content.serializers.createHeaderSerializer
  }
  protected getRuntimeImport(): string | [string, string] {
    return this.paramsPkg.imports.serializers
  }
  protected getRuntimeFactoryName(): string {
    return this.paramsPkg.exports.serializers
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.header ?? []
  }
}
