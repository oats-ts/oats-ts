import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { ParameterObject } from '@oats-ts/openapi-model'
import { InputParameterTypesGenerator } from '../utils/InputParameterTypesGenerator'

export class RequestHeadersTypesGenerator extends InputParameterTypesGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-headers-type'
  }

  protected getParameterObjects(data: EnhancedOperation): ParameterObject[] {
    return data.header
  }
}
