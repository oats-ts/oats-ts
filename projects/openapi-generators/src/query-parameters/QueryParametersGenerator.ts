import { Referenceable } from '@oats-ts/json-schema-model'
import { OpenApiParameterSerializationExports } from '@oats-ts/model-common/lib/packages'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject, ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'
import { BaseParameterGenerators } from '../utils/BaseParametersGenerator'

export class QueryParametersGenerator extends BaseParameterGenerators {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/query-parameters'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/query-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/query-type'
  }
  protected getParametersType(): keyof OpenApiParameterSerializationExports {
    return 'QueryParameters'
  }
  protected getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[] {
    return item.query
  }
  protected getDefaultStyle(): ParameterStyle {
    return 'form'
  }
  protected getLocation(): ParameterLocation {
    return 'query'
  }
  protected getDefaultRequired(): boolean {
    return false
  }
  protected getDefaultExplode(): boolean {
    return true
  }
}
