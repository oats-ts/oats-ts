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
  PrimitiveType,
} from '@oats-ts/openapi-common'
import { BaseParameterObject, ContentObject, ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'
import { getNamedImports, getPropertyChain, isIdentifier } from '@oats-ts/typescript-common'
import { entries, flatMap, isNil, values } from 'lodash'
import { Expression, factory, ImportDeclaration, PropertyAssignment, TypeReferenceNode } from 'typescript'
import { ParameterDescriptorsGenerator } from './internalTypes'
import { ParameterFactoryFields } from './OatsApiNames'

const PrimitiveOrder: Record<PrimitiveType, number> = {
  boolean: 0,
  number: 1,
  string: 2,
  'non-primitive': 10,
  nil: 10,
}

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

  public getValidatorImports(path: string, parameters: Referenceable<BaseParameterObject>[]): ImportDeclaration[] {
    return [
      getNamedImports(this.validatorPkg.name, [this.validatorPkg.imports.validators]),
      ...this.context.dependenciesOf<ImportDeclaration>(path, this.getFakeSchema(parameters), 'oats/type-validator'),
    ]
  }

  public getValidatorSchemaAst(parameters: Referenceable<BaseParameterObject>[]): Expression {
    return this.context.referenceOf(this.getFakeSchema(parameters), 'oats/type-validator')
  }

  public getImports<T>(path: string, input: T, parameters: Referenceable<BaseParameterObject>[]): ImportDeclaration[] {
    return [
      getNamedImports(this.paramsPkg.name, [
        this.paramsPkg.imports.parameter,
        this.paramsPkg.imports[this.parametersTypeKey],
      ]),
      ...this.context.dependenciesOf<ImportDeclaration>(path, input, this.getModelTargetType()),
      ...this.getValidatorImports(path, parameters),
    ]
  }

  protected getFakeSchema(parameters: Referenceable<BaseParameterObject>[]) {
    const namedParameters: [string, BaseParameterObject][] = flatMap(parameters, (param) => {
      const name = getParameterName(param, this.context)
      if (isNil(name)) {
        return []
      }
      return [[name, this.context.dereference(param, true)]]
    })
    const schemas: [string, Referenceable<SchemaObject>][] = flatMap(namedParameters, ([name, parameter]) => {
      if (!isNil(parameter.content)) {
        const [media] = values(parameter.content)
        return isNil(media?.schema) ? [] : [[name, media.schema]]
      }
      return isNil(parameter.schema) ? [] : [[name, parameter.schema]]
    })
    const fakeSchema: SchemaObject = {
      type: 'object',
      required: namedParameters.filter(([, p]) => p.required).map(([name]) => name),
      properties: schemas.reduce((props, [name, schema]) => ({ ...props, [name]: schema }), {}),
    }
    return fakeSchema
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
    const [mimeType] = entries(parameter.content)[0]!
    return factory.createCallExpression(
      getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
        this.location,
        ...(parameter.required ?? this.defaultRequired ? [ParameterFactoryFields.required] : []),
        ParameterFactoryFields.schema,
      ]),
      [],
      [factory.createStringLiteral(mimeType)],
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

    const types = getPrimitiveTypes(schemaOrRef, this.context)
      .sort((a, b) => PrimitiveOrder[a] - PrimitiveOrder[b])
      .map((primitiveType) =>
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
