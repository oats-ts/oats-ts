import { Referenceable } from '@oats-ts/json-schema-model'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { ParameterSegment, parsePathToSegments, TextSegment } from '@oats-ts/openapi-parameter-serialization'
import { getNamedImports } from '@oats-ts/typescript-common'
import { factory, ImportDeclaration, PropertyAssignment } from 'typescript'
import { BaseParameterGenerators } from '../utils/BaseParametersGenerator'
import { ParameterDescriptorsGenerator } from '../utils/internalTypes'
import { ParametersFields } from '../utils/OatsApiNames'
import { ParameterDescriptorsGeneratorImpl } from '../utils/ParameterDescriptorsGeneratorImpl'

export class PathParametersGenerator extends BaseParameterGenerators {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/path-parameters'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/path-type']
  }
  protected getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[] {
    return item.path
  }
  protected getImports(path: string, data: EnhancedOperation): ImportDeclaration[] {
    return [
      ...super.getImports(path, data),
      getNamedImports(this.paramsPkg.name, [
        this.paramsPkg.imports.parsePathToMatcher,
        this.paramsPkg.imports.parsePathToSegments,
      ]),
    ]
  }
  protected removeQuerySegments(path: string): string {
    return parsePathToSegments(path)
      .filter((seg): seg is ParameterSegment | TextSegment => seg.type !== 'query')
      .map((seg) => (seg.type === 'parameter' ? `{${seg.name}}` : seg.value))
      .join('')
  }
  protected getMatcherPropertyAssignment(item: EnhancedOperation): PropertyAssignment {
    return factory.createPropertyAssignment(
      ParametersFields.matcher,
      factory.createCallExpression(
        factory.createIdentifier(this.paramsPkg.exports.parsePathToMatcher),
        [],
        [factory.createStringLiteral(this.removeQuerySegments(item.url))],
      ),
    )
  }
  protected getSegmentsPropertyAssignment(item: EnhancedOperation): PropertyAssignment {
    return factory.createPropertyAssignment(
      ParametersFields.pathSegments,
      factory.createCallExpression(
        factory.createIdentifier(this.paramsPkg.exports.parsePathToSegments),
        [],
        [factory.createStringLiteral(this.removeQuerySegments(item.url))],
      ),
    )
  }
  protected getPropertyAssignments(item: EnhancedOperation): PropertyAssignment[] {
    return [
      ...super.getPropertyAssignments(item),
      this.getMatcherPropertyAssignment(item),
      this.getSegmentsPropertyAssignment(item),
    ]
  }
  protected createParameterDescriptorsGenerator(): ParameterDescriptorsGenerator {
    return new ParameterDescriptorsGeneratorImpl(
      this.context(),
      this.paramsPkg,
      'oats/path-type',
      'PathParameters',
      'path',
      'simple',
      false,
      true,
    )
  }
}
