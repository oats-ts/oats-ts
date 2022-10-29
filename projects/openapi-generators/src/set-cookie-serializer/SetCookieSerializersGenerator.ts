import { packages } from '@oats-ts/model-common'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class SetCookieSerializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/set-cookie-serializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/cookies-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/cookies-type'
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.serializers.createSetCookieSerializer
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.serializers
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.cookie ?? []
  }
}
