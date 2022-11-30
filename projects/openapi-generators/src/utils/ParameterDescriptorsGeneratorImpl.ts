import { Referenceable, SchemaObject, SchemaObjectType } from '@oats-ts/json-schema-model'
import { getInferredType, OpenApiParameterSerializationPackage } from '@oats-ts/model-common'
import { getParameterKind, getParameterName, OpenAPIGeneratorContext, ParameterKind } from '@oats-ts/openapi-common'
import { BaseParameterObject, ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'
import { getLiteralAst, getPropertyChain, isIdentifier } from '@oats-ts/typescript-common'
import { entries, isNil } from 'lodash'
import { Expression, factory, PropertyAssignment } from 'typescript'
import { ParameterDescriptorsGenerator } from './internalTypes'
import { ParameterFactoryFields } from './OatsApiNames'

export class ParameterDescriptorsGeneratorImpl implements ParameterDescriptorsGenerator {
  constructor(
    protected context: OpenAPIGeneratorContext,
    protected paramsPkg: OpenApiParameterSerializationPackage,
    protected location: ParameterLocation,
    protected defaultStyle: ParameterStyle,
    protected defaultExplode: boolean,
    protected defaultRequired: boolean,
  ) {}

  public getParameterDescriptorAst(parameters: Referenceable<BaseParameterObject>[]): Expression {
    return factory.createObjectLiteralExpression(
      parameters
        .map((param) => this.getParameterDescriptorPropertyAst(param))
        .filter((prop): prop is PropertyAssignment => !isNil(prop)),
    )
  }

  protected getKind(param: BaseParameterObject): ParameterKind {
    return isNil(param.schema) ? 'unknown' : getParameterKind(this.context.dereference(param.schema, true))
  }

  protected getParameterDescriptorPropertyAst(
    param: Referenceable<BaseParameterObject>,
  ): PropertyAssignment | undefined {
    const name = getParameterName(param, this.context)
    const parameter = this.context.dereference(param, true)
    const schema = this.context.dereference(parameter.schema)

    if (isNil(schema) || isNil(name)) {
      return undefined
    }

    const valueAst = factory.createCallExpression(
      getPropertyChain(factory.createIdentifier(this.paramsPkg.exports.parameter), [
        this.location,
        parameter.style ?? this.defaultStyle,
        ...(parameter.explode ?? this.defaultExplode ? [ParameterFactoryFields.exploded] : []),
        ...(parameter.required ?? this.defaultRequired ? [ParameterFactoryFields.required] : []),
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
    const schema = this.context.dereference(schemaOrRef, true)
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
