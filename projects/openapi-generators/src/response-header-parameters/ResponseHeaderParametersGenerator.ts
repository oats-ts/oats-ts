import { GeneratorInit, RuntimeDependency, version } from '@oats-ts/oats-ts'
import {
  EnhancedOperation,
  getResponseHeaders,
  hasResponseHeaders,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { entries, values } from 'lodash'
import {
  factory,
  Identifier,
  ImportDeclaration,
  NodeFlags,
  PropertyAssignment,
  SourceFile,
  Statement,
  SyntaxKind,
} from 'typescript'
import { ParameterDescriptorsGenerator } from '../utils/internalTypes'
import { ParametersFields } from '../utils/OatsApiNames'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { ParameterDescriptorsGeneratorImpl } from '../utils/ParameterDescriptorsGeneratorImpl'

export class ResponseHeaderParametersGenerator extends OperationBasedCodeGenerator<{}> {
  protected descriptorsGenerator!: ParameterDescriptorsGenerator

  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-header-parameters'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/response-headers-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.paramsPkg.name, version }]
  }

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.descriptorsGenerator = this.createParameterDescriptorsGenerator()
  }

  protected shouldGenerate(data: EnhancedOperation): boolean {
    return hasResponseHeaders(data.operation, this.context())
  }

  public referenceOf(input: OperationObject): Identifier | undefined {
    return hasResponseHeaders(input, this.context())
      ? factory.createIdentifier(this.context().nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponseHeaders(input, this.context())
      ? getModelImports(fromPath, this.name(), [input], this.context())
      : []
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(data.operation, this.name())
    return success(
      createSourceFile(path, this.getImportDeclarations(path, data), [this.getResponseHeaderParametersAst(data)]),
    )
  }

  protected createParameterDescriptorsGenerator(): ParameterDescriptorsGenerator {
    return new ParameterDescriptorsGeneratorImpl(
      this.context(),
      this.paramsPkg,
      'oats/response-headers-type',
      'HeaderParameters',
      'header',
      'simple',
      false,
      false,
    )
  }

  protected getImportDeclarations(_path: string, _data: EnhancedOperation): ImportDeclaration[] {
    return [getNamedImports(this.paramsPkg.name, [this.paramsPkg.imports.parameter])]
  }

  protected getResponseHeaderParametersAst(data: EnhancedOperation): Statement {
    const headers = entries(getResponseHeaders(data.operation, this.context()))
    const props = headers
      .filter(([, headers]) => values(headers).length > 0)
      .map(([status, headers]): PropertyAssignment => {
        return factory.createPropertyAssignment(
          status === 'default' ? factory.createStringLiteral(status) : factory.createNumericLiteral(status),
          factory.createObjectLiteralExpression([
            factory.createPropertyAssignment(
              ParametersFields.descriptor,
              this.descriptorsGenerator.getParameterDescriptorAst(values(headers)),
            ),
          ]),
        )
      })

    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            this.context().nameOf(data.operation, this.name()),
            undefined,
            undefined,
            factory.createAsExpression(
              factory.createObjectLiteralExpression(props),
              factory.createTypeReferenceNode('const'),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }
}
