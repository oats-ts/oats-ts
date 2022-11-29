import { Referenceable, SchemaObject, SchemaObjectType } from '@oats-ts/json-schema-model'
import { getInferredType } from '@oats-ts/model-common'
import { OpenApiParameterSerializationExports } from '@oats-ts/model-common/lib/packages'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import {
  OpenAPIGeneratorTarget,
  EnhancedOperation,
  getParameterName,
  ParameterKind,
  getParameterKind,
} from '@oats-ts/openapi-common'
import { BaseParameterObject, ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import {
  createSourceFile,
  getLiteralAst,
  getNamedImports,
  getPropertyChain,
  isIdentifier,
} from '@oats-ts/typescript-common'
import { entries, isNil } from 'lodash'
import {
  Expression,
  factory,
  ImportDeclaration,
  NodeFlags,
  PropertyAssignment,
  SourceFile,
  Statement,
  SyntaxKind,
  TypeReferenceNode,
} from 'typescript'
import { ParameterFactoryFields, ParametersFields } from './OatsApiNames'
import { OperationBasedCodeGenerator } from './OperationBasedCodeGenerator'

export abstract class BaseParameterGenerators extends OperationBasedCodeGenerator<{}> {
  public abstract name(): OpenAPIGeneratorTarget

  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected abstract getTypeGeneratorTarget(): OpenAPIGeneratorTarget

  protected abstract getParametersType(): keyof OpenApiParameterSerializationExports

  protected abstract getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[]

  protected abstract getDefaultStyle(): ParameterStyle

  protected abstract getLocation(): ParameterLocation

  protected abstract getDefaultRequired(): boolean

  protected abstract getDefaultExplode(): boolean

  protected getKind(param: BaseParameterObject): ParameterKind {
    return isNil(param.schema) ? 'unknown' : getParameterKind(this.context().dereference(param.schema, true))
  }

  public referenceOf(input: any) {
    throw new Error('Method not implemented.')
  }

  public dependenciesOf(fromPath: string, input: any): any[] {
    throw new Error('Method not implemented.')
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.paramsPkg.name, version }]
  }

  protected shouldGenerate(item: EnhancedOperation): boolean {
    return this.getParameters(item).length > 0
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(item.operation, this.name())
    return success(createSourceFile(path, this.getImports(path, item), [this.getParametersStatementAst(item)]))
  }

  protected getImports(path: string, data: EnhancedOperation): ImportDeclaration[] {
    return [
      getNamedImports(this.paramsPkg.name, [
        this.paramsPkg.imports.parameter,
        this.paramsPkg.imports[this.getParametersType()],
      ]),
      ...this.context().dependenciesOf<ImportDeclaration>(path, data.operation, this.getTypeGeneratorTarget()),
    ]
  }

  protected getParametersStatementAst(item: EnhancedOperation): Statement {
    const parametersTypeName = this.paramsPkg.exports[this.getParametersType()]
    const parameterType = this.context().referenceOf<TypeReferenceNode>(item.operation, this.getTypeGeneratorTarget())
    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.context().nameOf(item.operation, this.name())),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(parametersTypeName), [parameterType]),
            this.getParametersExpressionAst(item),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getParametersExpressionAst(item: EnhancedOperation): Expression {
    return factory.createObjectLiteralExpression([
      factory.createPropertyAssignment(ParametersFields.descriptor, this.getDescriptorAst(item)),
    ])
  }

  protected getDescriptorAst(item: EnhancedOperation): Expression {
    return factory.createObjectLiteralExpression(
      this.getParameters(item)
        .map((param) => this.getParameterDescriptorPropertyAst(param))
        .filter((prop): prop is PropertyAssignment => !isNil(prop)),
    )
  }

  protected getParameterDescriptorPropertyAst(
    param: Referenceable<BaseParameterObject>,
  ): PropertyAssignment | undefined {
    const name = getParameterName(param, this.context())
    const parameter = this.context().dereference(param, true)
    const schema = this.context().dereference(parameter.schema)

    if (isNil(schema) || isNil(name)) {
      return undefined
    }

    const valueAst = factory.createCallExpression(
      getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
        this.getLocation(),
        parameter.style ?? this.getDefaultStyle(),
        ...(parameter.explode ?? this.getDefaultExplode() ? [ParameterFactoryFields.exploded] : []),
        ...(parameter.required ?? this.getDefaultRequired() ? [ParameterFactoryFields.required] : []),
        this.getKind(parameter),
      ]),
      [],
      [this.getValueDescriptor(schema)],
    )

    return factory.createPropertyAssignment(isIdentifier(name) ? name : factory.createStringLiteral(name), valueAst)
  }

  protected narrowLiteralType(type: SchemaObjectType | string): 'string' | 'number' | 'boolean' {
    switch (type) {
      case 'string':
        return 'string'
      case 'number':
      case 'integer':
        return 'number'
      case 'boolean':
        return 'boolean'
      default:
        throw new TypeError(`Unexpected enum type: "${type}"`)
    }
  }

  protected getLiteralType(schema: SchemaObject): 'string' | 'number' | 'boolean' {
    const narrowedType = isNil(schema.type) ? undefined : this.narrowLiteralType(schema.type)
    if (!isNil(narrowedType)) {
      return narrowedType
    }
    const types = Array.from(new Set((schema.enum ?? []).map((value) => typeof value)))
    switch (types.length) {
      case 0:
        throw new TypeError(`Can't infer enum type`)
      case 1:
        return this.narrowLiteralType(types[0])
      default:
        throw new TypeError(`Enum must be of same type`)
    }
  }

  protected getValueDescriptor(schemaOrRef: Referenceable<SchemaObject> | undefined): Expression {
    const schema = this.context().dereference(schemaOrRef, true)
    if (isNil(schema)) {
      return factory.createIdentifier('undefined')
    }
    const inferredType = getInferredType(schema)
    switch (inferredType) {
      case 'string':
      case 'number':
      case 'boolean': {
        return factory.createCallExpression(
          getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
            ParameterFactoryFields.value,
            inferredType,
          ]),
          [],
          [],
        )
      }
      case 'enum': {
        return factory.createCallExpression(
          getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
            ParameterFactoryFields.value,
            this.getLiteralType(schema),
          ]),
          [],
          [
            factory.createCallExpression(
              getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
                ParameterFactoryFields.value,
                ParameterFactoryFields.enum,
              ]),
              [],
              [factory.createArrayLiteralExpression((schema.enum ?? []).map((v) => getLiteralAst(v)))],
            ),
          ],
        )
      }
      case 'array': {
        // TODO is this ok?
        return this.getValueDescriptor(typeof schema.items === 'boolean' ? { type: 'string' } : schema.items)
      }
      case 'object': {
        const properties = entries(schema.properties).map(([name, propSchema]) => {
          const isRequired = (schema.required || []).indexOf(name) >= 0
          const requiredValueDesc = this.getValueDescriptor(propSchema)
          const valueDesc = isRequired
            ? requiredValueDesc
            : factory.createCallExpression(
                getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
                  ParameterFactoryFields.value,
                  ParameterFactoryFields.optional,
                ]),
                [],
                [requiredValueDesc],
              )
          return factory.createPropertyAssignment(
            isIdentifier(name) ? name : factory.createStringLiteral(name),
            valueDesc,
          )
        })
        return factory.createObjectLiteralExpression(properties)
      }
      default:
        return factory.createIdentifier('undefined')
    }
  }
}
