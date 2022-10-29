import { packages } from '@oats-ts/model-common'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { Expression, factory } from 'typescript'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'

export class PathSerializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/path-serializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/path-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/path-type'
  }
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.serializers
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.serializers.createPathSerializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.path ?? []
  }
  protected getExtraFactoryFunctionParameters(data: EnhancedOperation): Expression[] {
    return [factory.createStringLiteral(data.url)]
  }
}
