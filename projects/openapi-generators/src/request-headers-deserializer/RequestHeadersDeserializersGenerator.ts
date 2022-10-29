import { packages } from '@oats-ts/model-common'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class RequestHeadersDeserializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-headers-deserializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/request-headers-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/request-headers-type'
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.deserializers
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.deserializers.createHeaderDeserializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.header ?? []
  }
}
