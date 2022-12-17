import { Referenceable } from '@oats-ts/json-schema-model'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { BaseParameterGenerators } from '../utils/BaseParametersGenerator'
import { ParameterDescriptorsGenerator } from '../utils/internalTypes'
import { ParameterDescriptorsGeneratorImpl } from '../utils/ParameterDescriptorsGeneratorImpl'

export class QueryParametersGenerator extends BaseParameterGenerators {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/query-parameters'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/query-type', 'oats/type-validator']
  }
  protected getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[] {
    return item.query
  }
  protected createParameterDescriptorsGenerator(): ParameterDescriptorsGenerator {
    return new ParameterDescriptorsGeneratorImpl(
      this.context(),
      this.paramsPkg,
      this.rulesPkg,
      'oats/query-type',
      'QueryDescriptorRule',
      'query',
      'form',
      true,
      false,
    )
  }
}
