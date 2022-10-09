import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { TypeNode, ImportDeclaration, SourceFile, factory, SyntaxKind, PropertySignature, Statement } from 'typescript'
import { TypesGeneratorConfig } from './typings'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, documentNode, getModelImports, safeName } from '@oats-ts/typescript-common'
import { SchemaBasedCodeGenerator } from '../SchemaBasedCodeGenerator'
import { JsonSchemaGeneratorTarget, JsonSchemaReadOutput } from '../types'
import { RuntimeDependency } from '@oats-ts/oats-ts'
import { getDiscriminators, getReferencedNamedSchemas } from '@oats-ts/model-common'
import { entries, has, isNil, sortBy } from 'lodash'

export class JsonSchemaTypesGenerator<T extends JsonSchemaReadOutput> extends SchemaBasedCodeGenerator<
  T,
  TypesGeneratorConfig
> {
  public name(): JsonSchemaGeneratorTarget {
    return 'oats/type'
  }

  public consumes(): JsonSchemaGeneratorTarget[] {
    return []
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  public referenceOf(input: Referenceable<SchemaObject>): TypeNode {
    const typeName = this.context.nameOf(input)
    return isNil(typeName) ? this.getTypeReferenceAst(input) : factory.createTypeReferenceNode(typeName)
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return this.getTypeImports(fromPath, input, true)
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, this.name())
    return success(createSourceFile(path, this.getTypeImports(path, schema, false), [this.getNamedTypeAst(schema)]))
  }

  protected getNamedTypeAst(schema: Referenceable<SchemaObject>): Statement {
    const node = factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(this.context.nameOf(schema, this.name())),
      undefined,
      this.getRighthandSideTypeAst(schema),
    )
    return this.configuration().documentation && !this.isReferenceObject(schema) ? documentNode(node, schema) : node
  }

  protected getRighthandSideTypeAst(data: Referenceable<SchemaObject>): TypeNode {
    if (this.isReferenceObject(data)) {
      return this.getTypeReferenceAst(data)
    }
    if (this.isArraySchema(data)) {
      return this.getArrayTypeAst(data)
    } else if (this.isEnumSchema(data)) {
      return this.getLiteralUnionTypeAst(data)
    } else if (this.isObjectSchema(data)) {
      return this.getObjectTypeAst(data)
    } else if (this.isRecordSchema(data)) {
      return this.getRecordTypeAst(data)
    } else if (this.isUnionSchema(data)) {
      return this.getUnionTypeAst(data)
    } else if (this.isIntersectionSchema(data)) {
      return this.getIntersectionTypeAst(data)
    } else if (this.isLiteralSchema(data)) {
      return this.getLiteralTypeAst(data)
    } else if (this.isTupleSchema(data)) {
      return this.getTupleTypeAst(data)
    } else if (this.isStringSchema(data)) {
      return this.getStringTypeAst(data)
    } else if (this.isBooleanSchema(data)) {
      return this.getBooleanTypeAst(data)
    } else if (this.isNumberSchema(data)) {
      return this.getNumberTypeAst(data)
    }
    return this.getFallbackTypeAst(data)
  }

  protected getTypeReferenceAst(data: Referenceable<SchemaObject> | undefined): TypeNode {
    const schema = isNil(data) ? undefined : this.context.dereference(data)
    if (isNil(schema)) {
      return this.getFallbackTypeAst(data)
    }
    const name = this.context.nameOf(schema)
    if (isNil(name)) {
      return this.getRighthandSideTypeAst(schema)
    }
    return factory.createTypeReferenceNode(name)
  }

  protected getArrayTypeAst(data: SchemaObject): TypeNode {
    const itemsType =
      typeof data.items === 'boolean' ? this.getFallbackTypeAst(undefined) : this.getTypeReferenceAst(data.items)
    return factory.createArrayTypeNode(itemsType)
  }

  protected getLiteralUnionTypeAst(data: SchemaObject): TypeNode {
    return factory.createUnionTypeNode((data.enum ?? []).map((value) => this.getJsonLiteralTypeAst(value)))
  }

  protected getJsonLiteralTypeAst(value: any): TypeNode {
    if (value === null) {
      return factory.createLiteralTypeNode(factory.createNull())
    } else if (typeof value === 'string') {
      return factory.createLiteralTypeNode(factory.createStringLiteral(value))
    } else if (typeof value === 'number') {
      return factory.createLiteralTypeNode(factory.createNumericLiteral(value))
    } else if (typeof value === 'boolean') {
      return factory.createLiteralTypeNode(value ? factory.createTrue() : factory.createFalse())
    } else if (Array.isArray(value)) {
      return factory.createTupleTypeNode(value.map((item) => this.getJsonLiteralTypeAst(item)))
    } else if (typeof value === 'object') {
      return factory.createTypeLiteralNode(
        entries(value).map(([key, propertyValue]) =>
          factory.createPropertySignature(
            undefined,
            safeName(key),
            undefined,
            this.getJsonLiteralTypeAst(propertyValue),
          ),
        ),
      )
    }
    // TODO if this happens, it needs a second look.
    return factory.createTypeReferenceNode('never')
  }

  protected getLiteralTypeAst(data: SchemaObject): TypeNode {
    return this.getJsonLiteralTypeAst(data.const)
  }

  protected getObjectTypeAst(data: SchemaObject): TypeNode {
    const discriminators = getDiscriminators(data, this.context) || {}
    const config = this.configuration()
    const discriminatorProperties = sortBy(entries(discriminators), ([name]) => name).map(
      ([name, value]): PropertySignature => {
        return factory.createPropertySignature(
          undefined,
          safeName(name),
          undefined,
          factory.createLiteralTypeNode(factory.createStringLiteral(value)),
        )
      },
    )

    const properties = sortBy(entries(data.properties || {}), ([name]) => name)
      .filter(([name]) => !has(discriminators, name))
      .map(([name, schemaOrRef]): PropertySignature => {
        const isOptional = (data.required || []).indexOf(name) < 0
        const node = factory.createPropertySignature(
          undefined,
          safeName(name),
          isOptional ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
          this.getTypeReferenceAst(schemaOrRef),
        )
        return config.documentation && !this.isReferenceObject(data) ? documentNode(node, data) : node
      })

    return factory.createTypeLiteralNode(discriminatorProperties.concat(properties))
  }

  protected getRecordTypeAst(data: SchemaObject): TypeNode {
    const { additionalProperties } = data
    const schema = typeof additionalProperties === 'boolean' ? undefined : additionalProperties
    return factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
      this.getTypeReferenceAst(schema),
    ])
  }

  protected getUnionTypeAst(data: SchemaObject): TypeNode {
    return factory.createUnionTypeNode((data.oneOf ?? []).map((type) => this.getTypeReferenceAst(type)))
  }

  protected getIntersectionTypeAst(data: SchemaObject): TypeNode {
    const types = (data.allOf ?? [])
      .map((type) => this.getTypeReferenceAst(type))
      .filter((ast) => ast.kind !== SyntaxKind.AnyKeyword)
    return types.length > 0 ? factory.createIntersectionTypeNode(types) : this.getFallbackTypeAst(data)
  }

  protected getTupleTypeAst(schema: SchemaObject): TypeNode {
    const { prefixItems = [], minItems = 0 } = schema
    const types = prefixItems.map((tupleItem, index) => {
      const type = this.getTypeReferenceAst(tupleItem)
      return index < minItems ? type : factory.createOptionalTypeNode(type)
    })
    return factory.createTupleTypeNode(types)
  }

  protected getStringTypeAst(schema: SchemaObject): TypeNode {
    return factory.createKeywordTypeNode(SyntaxKind.StringKeyword)
  }

  protected getNumberTypeAst(schema: SchemaObject): TypeNode {
    return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword)
  }

  protected getBooleanTypeAst(schema: SchemaObject): TypeNode {
    return factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword)
  }

  protected getFallbackTypeAst(schema: Referenceable<SchemaObject> | undefined): TypeNode {
    return factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
  }

  protected getTypeImports(
    fromPath: string,
    schema: Referenceable<SchemaObject>,
    referenceOnly: boolean,
  ): ImportDeclaration[] {
    const name = this.context.nameOf(schema)
    if (referenceOnly && !isNil(name)) {
      return getModelImports<JsonSchemaGeneratorTarget>(fromPath, this.name(), [schema], this.context)
    }
    const refSchemas = getReferencedNamedSchemas(schema, this.context)
    return getModelImports<JsonSchemaGeneratorTarget>(fromPath, this.name(), refSchemas, this.context)
  }
}
