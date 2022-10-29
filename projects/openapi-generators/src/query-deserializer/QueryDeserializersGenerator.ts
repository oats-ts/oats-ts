import { packages } from '@oats-ts/model-common'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class QueryDeserializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/query-deserializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/query-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/query-type'
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.deserializers
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.deserializers.createQueryDeserializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.query ?? []
  }
}
