import { Referenceable } from '@oats-ts/json-schema-model'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseParameterGenerators } from '../utils/BaseParametersGenerator'
import { ParameterDescriptorsGenerator } from '../utils/internalTypes'
import { ParameterDescriptorsGeneratorImpl } from '../utils/ParameterDescriptorsGeneratorImpl'

export class RequestHeaderParametersGenerator extends BaseParameterGenerators {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-header-parameters'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/request-headers-type']
  }
  protected getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[] {
    return item.header
  }
  protected createParameterDescriptorsGenerator(): ParameterDescriptorsGenerator {
    return new ParameterDescriptorsGeneratorImpl(
      this.context(),
      this.paramsPkg,
      'oats/request-headers-type',
      'HeaderParameters',
      'header',
      'simple',
      false,
      false,
    )
  }
}
