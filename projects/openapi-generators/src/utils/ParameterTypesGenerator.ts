import { RuntimeDependency } from '@oats-ts/oats-ts'
import { BaseParameterObject, OperationObject, ParameterObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, values } from 'lodash'
import {
  createOpenAPIGeneratorContext,
  EnhancedOperation,
  getReferencedNamedSchemas,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { TypeNode, ImportDeclaration, factory, SourceFile, SyntaxKind, PropertySignature } from 'typescript'
import { ParameterTypesGeneratorConfig } from './parameterTypings'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, documentNode, safeName } from '@oats-ts/typescript-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPICodeGeneratorImpl } from './OpenAPICodeGeneratorImpl'

export abstract class ParameterTypesGenerator<T> extends OpenAPICodeGeneratorImpl<ParameterTypesGeneratorConfig, T> {
  public abstract name(): OpenAPIGeneratorTarget
  protected abstract getParameterObjects(data: T): BaseParameterObject[]
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

    const path = this.context().pathOf(nameable, this.name())

    const ast = factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      this.context().nameOf(nameable, this.name()),
      undefined,
      this.getTypeLiteral(parameters),
    )
    return success(createSourceFile(path, this.getImports(path, parameters), [ast]))
  }

  protected getImports(path: string, parameters: BaseParameterObject[]): ImportDeclaration[] {
    const referencedSchemas = getReferencedNamedSchemas(this.getParameterSchemaObject(parameters), this.context())
    return flatMap(referencedSchemas, (schema) => this.context().dependenciesOf(path, schema, 'oats/type'))
  }

  protected getTypeLiteral(parameters: BaseParameterObject[]) {
    return factory.createTypeLiteralNode(
      this.getNamedParameters(parameters).map(([name, parameter]) => {
        const node = this.createProperty(
          name,
          Boolean(parameter.required),
          this.context().referenceOf(this.getParameterSchema(parameter), 'oats/type'),
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

  protected getParameterSchema(param: BaseParameterObject): Referenceable<SchemaObject> {
    if (!isNil(param.content)) {
      const [media] = values(param.content)
      return media?.schema!
    }
    return param.schema!
  }

  protected getNamedParameters(params: BaseParameterObject[]): [string, BaseParameterObject][] {
    return params.map((param) => {
      const name = (param as ParameterObject).name ?? this.context().nameOf(param)
      return [name, param]
    })
  }

  protected getParameterSchemaObject(params: BaseParameterObject[]): SchemaObject {
    const namedParams = this.getNamedParameters(params)
    const required = namedParams.filter(([, param]) => param.required).map(([name]) => name)
    const properties = namedParams.reduce((props, [name, param]) => {
      return {
        ...props,
        [name]: this.getParameterSchema(param),
      }
    }, {} as Record<string, Referenceable<SchemaObject>>)
    return {
      type: 'object',
      required,
      properties,
    }
  }
}
