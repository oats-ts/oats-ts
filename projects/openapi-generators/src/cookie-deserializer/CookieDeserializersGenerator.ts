import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { packages } from '@oats-ts/model-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class CookieDeserializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cookie-deserializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/cookies-type']
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.deserializers
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/cookies-type'
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.deserializers.createCookieDeserializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.cookie ?? []
  }
}
