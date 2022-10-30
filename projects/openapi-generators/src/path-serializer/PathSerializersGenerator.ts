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
  protected getRuntimeFactoryName(): string {
    return this.paramsPkg.exports.serializers
  }
  protected getRuntimeImport(): string | [string, string] {
    return this.paramsPkg.imports.serializers
  }
  protected getFactoryFunctionName(): string {
    return this.paramsPkg.content.serializers.createPathSerializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.path ?? []
  }
  protected getExtraFactoryFunctionParameters(data: EnhancedOperation): Expression[] {
    return [factory.createStringLiteral(data.url)]
  }
}
