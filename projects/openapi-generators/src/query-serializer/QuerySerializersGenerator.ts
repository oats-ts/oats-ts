import { packages } from '@oats-ts/model-common'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class QuerySerializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/query-serializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/query-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/query-type'
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.serializers
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.serializers.createQuerySerializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.query ?? []
  }
}
