import { packages } from '@oats-ts/model-common'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class SetCookieDeserializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/set-cookie-deserializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/cookies-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/cookies-type'
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.deserializers.createSetCookieDeserializer
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.deserializers
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.cookie ?? []
  }
}
