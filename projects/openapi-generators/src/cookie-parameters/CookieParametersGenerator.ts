import { Referenceable } from '@oats-ts/json-schema-model'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseParameterGenerators } from '../utils/BaseParametersGenerator'
import { ParameterDescriptorsGenerator } from '../utils/internalTypes'
import { ParameterDescriptorsGeneratorImpl } from '../utils/ParameterDescriptorsGeneratorImpl'

export class CookieParametersGenerator extends BaseParameterGenerators {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cookie-parameters'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/cookies-type']
  }
  protected getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[] {
    return item.cookie
  }
  protected createParameterDescriptorsGenerator(): ParameterDescriptorsGenerator {
    return new ParameterDescriptorsGeneratorImpl(
      this.context(),
      this.paramsPkg,
      'oats/cookies-type',
      'CookieParameters',
      'cookie',
      'form',
      true,
      false,
    )
  }
}
