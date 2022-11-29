import { Referenceable } from '@oats-ts/json-schema-model'
import { OpenApiParameterSerializationExports } from '@oats-ts/model-common/lib/packages'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject, ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'
import { BaseParameterGenerators } from '../utils/BaseParametersGenerator'

export class RequestHeaderParametersGenerator extends BaseParameterGenerators {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-header-parameters'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/request-headers-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/request-headers-type'
  }
  protected getParametersType(): keyof OpenApiParameterSerializationExports {
    return 'HeaderParameters'
  }
  protected getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[] {
    return item.header
  }
  protected getDefaultStyle(): ParameterStyle {
    return 'simple'
  }
  protected getLocation(): ParameterLocation {
    return 'header'
  }
  protected getDefaultRequired(): boolean {
    return false
  }
  protected getDefaultExplode(): boolean {
    return true
  }
}
