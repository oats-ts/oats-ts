import { packages } from '@oats-ts/model-common'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class CookieSerializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cookie-serializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/cookies-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/cookies-type'
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.serializers
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.serializers.createCookieSerializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.cookie ?? []
  }
}
