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
  protected getRuntimeFactoryName(): string {
    return this.paramsPkg.exports.deserializers
  }
  protected getRuntimeImport(): string | [string, string] {
    return this.paramsPkg.imports.deserializers
  }
  protected getFactoryFunctionName(): string {
    return this.paramsPkg.content.deserializers.createQueryDeserializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.query ?? []
  }
}
