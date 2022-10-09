import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { ParameterObject } from '@oats-ts/openapi-model'
import { InputParameterTypesGenerator } from '../utils/InputParameterTypesGenerator'

export class QueryTypesGenerator extends InputParameterTypesGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/query-type'
  }
  protected getParameterObjects(data: EnhancedOperation): ParameterObject[] {
    return data.query
  }
}
