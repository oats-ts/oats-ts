import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import {
  getParameterName,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  OpenApiParameterSerializationPackage,
  OpenApiParameterSerializationExports,
  ValidatorsPackage,
  getFundamentalTypes,
  getPrimitiveTypes,
  FundamentalType,
} from '@oats-ts/openapi-common'
import { BaseParameterObject, ContentObject, ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'
import { getNamedImports, getPropertyChain, isIdentifier } from '@oats-ts/typescript-common'
import { entries, flatMap, isNil, values } from 'lodash'
import { Expression, factory, ImportDeclaration, PropertyAssignment, TypeReferenceNode } from 'typescript'
import { ParameterDescriptorsGenerator } from './internalTypes'
import { ParameterFactoryFields } from './OatsApiNames'

export class ParameterDescriptorsGeneratorImpl implements ParameterDescriptorsGenerator {
  constructor(
    protected context: OpenAPIGeneratorContext,
    protected paramsPkg: OpenApiParameterSerializationPackage,
    protected validatorPkg: ValidatorsPackage,
    protected modelTypeTarget: OpenAPIGeneratorTarget,
    protected parametersTypeKey: keyof OpenApiParameterSerializationExports,
    protected location: ParameterLocation,
    protected defaultStyle: ParameterStyle,
    protected defaultExplode: boolean,
    protected defaultRequired: boolean,
  ) {}
  public getModelTargetType(): OpenAPIGeneratorTarget {
    return this.modelTypeTarget
  }

  public getValidatorImports<T>(
    path: string,
    input: T,
    params: Referenceable<BaseParameterObject>[],
  ): ImportDeclaration[] {
    const parameters = params.map((p) => this.context.dereference(p))
    const validatorImports = flatMap(
      flatMap(parameters, (p) => this.getSchemasOfContent(p.content)),
      (schema) => this.context.dependenciesOf<ImportDeclaration>(path, schema, 'oats/type-validator'),
    )
    return [
      ...(validatorImports.length > 0
        ? [getNamedImports(this.validatorPkg.name, [this.validatorPkg.imports.validators])]
        : []),
      ...this.context.dependenciesOf<ImportDeclaration>(path, input, this.getModelTargetType()),
      ...validatorImports,
    ]
  }

  public getImports<T>(path: string, input: T, params: Referenceable<BaseParameterObject>[]): ImportDeclaration[] {
    return [
      getNamedImports(this.paramsPkg.name, [
        this.paramsPkg.imports.parameter,
        this.paramsPkg.imports[this.parametersTypeKey],
      ]),
      ...this.getValidatorImports(path, input, params),
    ]
  }

  protected getSchemasOfContent(content?: ContentObject): Referenceable<SchemaObject>[] {
    if (isNil(content)) {
      return []
    }
    return values(content)
      .map((media) => media.schema)
      .filter((schema): schema is Referenceable<SchemaObject> => !isNil(schema))
  }

  public getParametersTypeAst<T>(input: T): TypeReferenceNode {
    const parametersTypeName = this.paramsPkg.exports[this.parametersTypeKey]
    const parameterType = this.context.referenceOf<TypeReferenceNode>(input, this.getModelTargetType())
    return factory.createTypeReferenceNode(factory.createIdentifier(parametersTypeName), [parameterType])
  }

  public getParameterDescriptorAst(parameters: Referenceable<BaseParameterObject>[]): Expression {
    return factory.createObjectLiteralExpression(
      parameters
        .map((param) => this.getParameterDescriptorPropertyAst(param))
        .filter((prop): prop is PropertyAssignment => !isNil(prop)),
    )
  }

  protected getFundamentalType(schema: Referenceable<SchemaObject>): FundamentalType {
    return getFundamentalTypes(schema, this.context)[0]
  }

  protected getParameterDescriptorPropertyAst(
    param: Referenceable<BaseParameterObject>,
  ): PropertyAssignment | undefined {
    const name = getParameterName(param, this.context)
    const valueAst = this.getDescriptorAst(this.context.dereference(param, true))
    if (isNil(valueAst) || isNil(name)) {
      return undefined
    }
    return factory.createPropertyAssignment(isIdentifier(name) ? name : factory.createStringLiteral(name), valueAst)
  }

  private getDescriptorAst(parameter: BaseParameterObject): Expression | undefined {
    if (isNil(parameter.content)) {
      const schema = this.context.dereference(parameter.schema)
      if (isNil(schema)) {
        return undefined
      }
      return factory.createCallExpression(
        getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
          this.location,
          parameter.style ?? this.defaultStyle,
          ...(parameter.explode ?? this.defaultExplode ? [ParameterFactoryFields.exploded] : []),
          ...(parameter.required ?? this.defaultRequired ? [ParameterFactoryFields.required] : []),
          this.getFundamentalType(schema),
        ]),
        [],
        [this.getValueDescriptors(schema)],
      )
    }
    const [mimeType, mediaTypeObj] = entries(parameter.content)[0]!
    const validator = this.context.referenceOf<Expression>(mediaTypeObj.schema, 'oats/type-validator')
    return factory.createCallExpression(
      getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
        this.location,
        ...(parameter.required ?? this.defaultRequired ? [ParameterFactoryFields.required] : []),
        ParameterFactoryFields.schema,
      ]),
      [],
      [factory.createStringLiteral(mimeType), validator],
    )
  }

  protected getValueDescriptors(schemaOrRef: Referenceable<SchemaObject> | undefined): Expression {
    const schema = this.context.dereference(schemaOrRef, true)
    if (isNil(schema)) {
      return factory.createIdentifier('undefined')
    }
    switch (this.getFundamentalType(schema)) {
      case 'primitive': {
        return this.getValueDescriptor(schema)
      }
      case 'array': {
        return this.getValueDescriptor(typeof schema.items === 'boolean' ? { type: 'string' } : schema.items)
      }
      case 'object': {
        const properties = entries(schema.properties ?? {}).map(([name, propSchema]) => {
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

  protected getValueDescriptor(schemaOrRef: Referenceable<SchemaObject> | undefined): Expression {
    if (isNil(schemaOrRef)) {
      return factory.createIdentifier('undefined')
    }

    const types = getPrimitiveTypes(schemaOrRef, this.context).map((primitiveType) =>
      factory.createCallExpression(
        getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
          ParameterFactoryFields.value,
          primitiveType,
        ]),
        [],
        [],
      ),
    )
    if (types.length === 1) {
      return types[0]
    }

    return factory.createCallExpression(
      getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
        ParameterFactoryFields.value,
        ParameterFactoryFields.union,
      ]),
      [],
      types,
    )
  }
}
