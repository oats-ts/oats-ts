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
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'

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
    const parameters = this.getParameterObjects(data)
    const nameable = this.getNameable(data)

    const path = this.context.pathOf(nameable, this.name())

    const ast = factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      this.context.nameOf(nameable, this.name()),
      undefined,
      this.getTypeLiteral(parameters),
    )
    return success(createSourceFile(path, this.getImports(path, parameters), [ast]))
  }

  protected getImports(path: string, parameters: (ParameterObject | HeaderObject)[]): ImportDeclaration[] {
    const referencedSchemas = getReferencedNamedSchemas(this.getParameterSchemaObject(parameters), this.context)
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
        return this.configuration().documentation ? documentNode(node, parameter) : node
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

  protected getParameterSchemaObject(params: (ParameterObject | HeaderObject)[]): SchemaObject {
    return {
      type: 'object',
      required: params
        .filter((param) => param.required)
        .map((param) => (param as ParameterObject).name ?? this.context.nameOf(param)),
      properties: params.reduce(
        (props: Record<string, SchemaObject | ReferenceObject>, param: ParameterObject | HeaderObject) => {
          return Object.assign(props, {
            [(param as ParameterObject).name ?? this.context.nameOf(param)]: param.schema,
          })
        },
        {},
      ),
    }
  }
}
