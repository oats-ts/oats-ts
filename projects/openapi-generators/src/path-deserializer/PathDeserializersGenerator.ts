import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { Expression, factory } from 'typescript'
import { pathToRegexp } from 'path-to-regexp'
import { BaseDslGenerator } from '../utils/BaseDslGenerator'
import { ParameterSegment, parsePathToSegments } from '@oats-ts/openapi-parameter-serialization'

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
  protected getRuntimeFactoryName(): string {
    return this.paramsPkg.exports.deserializers
  }
  protected getRuntimeImport(): string | [string, string] {
    return this.paramsPkg.imports.deserializers
  }
  protected getFactoryFunctionName(): string {
    return this.paramsPkg.content.deserializers.createPathDeserializer
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
      factory.createRegularExpressionLiteral(this.createPathRegExp(data.url).toString()),
    ]
  }

  protected createPathRegExp(path: string): RegExp {
    const segments = parsePathToSegments(path)
    const regexpInput = segments
      .map((segment) => (segment.type === 'text' ? segment.value : `:${segment.name}`))
      .join('')
    return pathToRegexp(regexpInput, [])
  }
}
