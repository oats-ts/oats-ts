import { packages } from '@oats-ts/model-common'
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
    return packages.openApiParameterSerialization.content.serializers.createHeaderSerializer
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.serializers
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.header ?? []
  }
}
