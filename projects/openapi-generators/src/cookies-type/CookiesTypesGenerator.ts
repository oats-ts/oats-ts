import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { ParameterObject } from '@oats-ts/openapi-model'
import { InputParameterTypesGenerator } from '../utils/parameters/InputParameterTypesGenerator'

export class CookiesTypesGenerator extends InputParameterTypesGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cookies-type'
  }
  protected getParameterObjects(data: EnhancedOperation): ParameterObject[] {
    return data.cookie
  }
}
