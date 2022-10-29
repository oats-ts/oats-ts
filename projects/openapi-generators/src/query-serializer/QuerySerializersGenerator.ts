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
  protected getRuntimeFactoryName(): string {
    return this.paramsPkg.exports.serializers
  }
  protected getRuntimeImport(): string | [string, string] {
    return this.paramsPkg.imports.serializers
  }
  protected getFactoryFunctionName(): string {
    return this.paramsPkg.content.serializers.createQuerySerializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.query ?? []
  }
}
