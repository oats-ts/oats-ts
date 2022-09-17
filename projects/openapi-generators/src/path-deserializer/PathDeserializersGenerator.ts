import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { Expression, factory } from 'typescript'
import { getPathParameterNames } from './pathUtils'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'
import { createPathRegExp } from '@oats-ts/openapi-parameter-serialization'

export class PathDeserializersGenerator extends BaseDslGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/path-deserializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/path-type']
  }
  protected getTypeGeneratorTarget(): OpenAPIGeneratorTarget {
    return 'oats/path-type'
  }
  protected getFactoryFunctionName(): string {
    return RuntimePackages.ParameterSerialization.createPathDeserializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.path ?? []
  }
  protected getExtraFactoryFunctionParameters(data: EnhancedOperation): Expression[] {
    return [
      factory.createArrayLiteralExpression(
        getPathParameterNames(data.url).map((name) => factory.createStringLiteral(name)),
      ),
      factory.createRegularExpressionLiteral(createPathRegExp(data.url).toString()),
    ]
  }
}
