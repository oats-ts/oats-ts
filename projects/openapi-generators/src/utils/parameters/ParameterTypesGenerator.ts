import { BaseCodeGenerator, RuntimeDependency } from '@oats-ts/oats-ts'
import { HeaderObject, OperationObject, ParameterObject } from '@oats-ts/openapi-model'
import { flatMap, isNil } from 'lodash'
import {
  createOpenAPIGeneratorContext,
  EnhancedOperation,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { TypeNode, ImportDeclaration, factory, SourceFile, SyntaxKind, PropertySignature } from 'typescript'
import { ParameterTypesGeneratorConfig } from './typings'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, documentNode, safeName } from '@oats-ts/typescript-common'
import { getReferencedNamedSchemas } from '@oats-ts/model-common'
import { getParameterSchemaObject } from './getParameterSchemaObject'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'

export abstract class ParameterTypesGenerator<T> extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  ParameterTypesGeneratorConfig,
  T,
  OpenAPIGeneratorContext
> {
  public abstract name(): OpenAPIGeneratorTarget
  protected abstract getParameterObjects(data: T): (ParameterObject | HeaderObject)[]
  protected abstract getEnhancedOperation(data: T): EnhancedOperation
  protected abstract getNameable(data: T): any

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  protected shouldGenerate(data: T): boolean {
    return this.getParameterObjects(data).length > 0
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  protected async generateItem(data: T): Promise<Try<SourceFile>> {
    const ehOperation = this.getEnhancedOperation(data)
    const parameters = this.getParameterObjects(data)
    const { operation } = ehOperation

    const path = this.context.pathOf(operation, this.name())

    const ast = factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      this.context.nameOf(this.getNameable(data), this.name()),
      undefined,
      this.getTypeLiteral(parameters),
    )
    return success(createSourceFile(path, this.getImports(path, parameters), [ast]))
  }

  protected getImports(path: string, parameters: (ParameterObject | HeaderObject)[]): ImportDeclaration[] {
    const referencedSchemas = getReferencedNamedSchemas(
      getParameterSchemaObject(parameters, this.context),
      this.context,
    )
    return flatMap(referencedSchemas, (schema) => this.context.dependenciesOf(path, schema, 'oats/type'))
  }

  protected getTypeLiteral(parameters: (ParameterObject | HeaderObject)[]) {
    return factory.createTypeLiteralNode(
      parameters.map((parameter) => {
        const name = (parameter as ParameterObject).name ?? this.context.nameOf(parameter)
        const node = this.createProperty(
          name,
          Boolean(parameter.required),
          this.context.referenceOf(parameter.schema, 'oats/type'),
        )
        return this.config.documentation ? documentNode(node, parameter) : node
      }),
    )
  }

  protected createProperty(name: string, required: boolean, typeNode: TypeNode): PropertySignature {
    return factory.createPropertySignature(
      undefined,
      safeName(name),
      required ? undefined : factory.createToken(SyntaxKind.QuestionToken),
      typeNode,
    )
  }

  protected enhanced(input: OperationObject): EnhancedOperation {
    const operation = this.items
      .map((data) => this.getEnhancedOperation(data))
      .find(({ operation }) => operation === input)

    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }
}