import { Referenceable } from '@oats-ts/json-schema-model'
import { OpenApiParameterSerializationExports } from '@oats-ts/model-common/lib/packages'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject, ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'
import { BaseParameterGenerators } from '../utils/BaseParametersGenerator'

export class CookieParametersGenerator extends BaseParameterGenerators {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cookie-parameters'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/cookies-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/cookies-type'
  }
  protected getParametersType(): keyof OpenApiParameterSerializationExports {
    return 'CookieParameters'
  }
  protected getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[] {
    return item.cookie
  }
  protected getDefaultStyle(): ParameterStyle {
    return 'form'
  }
  protected getLocation(): ParameterLocation {
    return 'cookie'
  }
  protected getDefaultRequired(): boolean {
    return false
  }
  protected getDefaultExplode(): boolean {
    return true
  }
}
