import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { Expression, factory } from 'typescript'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'
import { createPathRegExp, ParameterSegment, parsePathToSegments } from '@oats-ts/openapi-parameter-serialization'
import { packages } from '@oats-ts/model-common'

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
  protected getRuntimeExport(): string {
    return packages.openApiParameterSerialization.exports.deserializers
  }
  protected getFactoryFunctionName(): string {
    return packages.openApiParameterSerialization.content.deserializers.createPathDeserializer
  }
  protected getParameters(data: EnhancedOperation): BaseParameterObject[] {
    return data?.path ?? []
  }
  protected getPathParameterNames(path: string): string[] {
    return parsePathToSegments(path)
      .filter((s): s is ParameterSegment => s.type === 'parameter')
      .map((p: ParameterSegment) => p.name)
  }
  protected getExtraFactoryFunctionParameters(data: EnhancedOperation): Expression[] {
    return [
      factory.createArrayLiteralExpression(
        this.getPathParameterNames(data.url).map((name) => factory.createStringLiteral(name)),
      ),
      factory.createRegularExpressionLiteral(createPathRegExp(data.url).toString()),
    ]
  }
}
