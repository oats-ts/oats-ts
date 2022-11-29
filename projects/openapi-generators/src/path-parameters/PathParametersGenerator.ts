import { Referenceable } from '@oats-ts/json-schema-model'
import { OpenApiParameterSerializationExports } from '@oats-ts/model-common/lib/packages'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject, ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'
import { BaseParameterGenerators } from '../utils/BaseParametersGenerator'

export class PathParametersGenerator extends BaseParameterGenerators {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/path-parameters'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/path-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/path-type'
  }
  protected getParametersType(): keyof OpenApiParameterSerializationExports {
    return 'PathParameters'
  }
  protected getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[] {
    return item.path
  }
  protected getDefaultStyle(): ParameterStyle {
    return 'simple'
  }
  protected getLocation(): ParameterLocation {
    return 'path'
  }
  protected getDefaultRequired(): boolean {
    return true
  }
  protected getDefaultExplode(): boolean {
    return false
  }
}
