import { ValidatorImportProvider, ValidatorsGeneratorConfig } from './typings'
import { Expression, factory, ImportDeclaration, NodeFlags, SourceFile, Statement, SyntaxKind } from 'typescript'
import { SchemaObject, Referenceable, ReferenceObject } from '@oats-ts/json-schema-model'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, safeName } from '@oats-ts/typescript-common'
import { GeneratorInit, RuntimeDependency, version } from '@oats-ts/oats-ts'
import { entries, has, sortBy } from 'lodash'
import { ValidatorImportProviderImpl } from './ValidatorImportProviderImpl'
import { ExternalRefValidatorImportProviderImpl } from './ExternalRefValidatorImportProviderImpl'
import { SchemaBasedCodeGenerator } from '../utils/SchemaBasedCodeGenerator'
import {
  getDiscriminators,
  OpenAPIGeneratorTarget,
  OpenAPIReadOutput,
  ValidatorsPackage,
} from '@oats-ts/openapi-common'

export class JsonSchemaValidatorsGenerator extends SchemaBasedCodeGenerator<ValidatorsGeneratorConfig> {
  protected importProvider!: ValidatorImportProvider
  protected externalRefImportProvider!: ValidatorImportProvider

  public name(): OpenAPIGeneratorTarget {
    return 'oats/type-validator'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.getValidatorPackage().name, version }]
  }

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.importProvider = new ValidatorImportProviderImpl(
      this.context(),
      this.configuration(),
      this.helper,
      this.type,
      this.getValidatorPackage(),
    )
    this.externalRefImportProvider = new ExternalRefValidatorImportProviderImpl(
      this.context(),
      this.configuration(),
      this.helper,
      this.type,
      this.getValidatorPackage(),
    )
  }

  public referenceOf(input: Referenceable<SchemaObject>): Expression {
    return this.getRightHandSideValidatorAst(input)
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return this.externalRefImportProvider.getImports(fromPath, input)
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(schema, 'oats/type-validator')
    return success(
      createSourceFile(path, this.importProvider.getImports(path, schema), [this.getValidatorStatementAst(schema)]),
    )
  }

  protected getValidatorStatementAst(schema: Referenceable<SchemaObject>): Statement {
    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            this.context().nameOf(schema, this.name()),
            undefined,
            undefined,
            this.getRightHandSideValidatorAst(schema),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRightHandSideValidatorAst(data: Referenceable<SchemaObject>): Expression {
    if (this.configuration().ignore(data, this.helper)) {
      return factory.createCallExpression(this.getValidatorAst('any'), [], [])
    }

    if (this.type.isReferenceObject(data)) {
      return this.getReferenceTypeValidatorAst(data)
    } else if (this.type.isUnionSchema(data)) {
      return this.getUnionTypeValidatorAst(data)
    } else if (this.type.isEnumSchema(data)) {
      return this.getEnumTypeValidatorAst(data)
    } else if (this.type.isLiteralSchema(data)) {
      return this.getLiteralTypeValidatorAst(data)
    } else if (this.type.isIntersectionSchema(data)) {
      return this.getIntersectionTypeValidatorAst(data)
    } else if (this.type.isStringSchema(data)) {
      return this.getStringTypeValidatorAst(data)
    } else if (this.type.isNumberSchema(data)) {
      return this.getNumberTypeValidatorAst(data)
    } else if (this.type.isBooleanSchema(data)) {
      return this.getBooleanTypeValidatorAst(data)
    } else if (this.type.isRecordSchema(data)) {
      return this.getRecordTypeValidatorAst(data)
    } else if (this.type.isObjectSchema(data)) {
      return this.getObjectTypeValidatorAst(data)
    } else if (this.type.isArraySchema(data)) {
      return this.getArrayTypeValidatorAst(data)
    } else if (this.type.isTupleSchema(data)) {
      return this.getTupleTypeValidatorAst(data)
    }
    return this.getUnknownTypeValidatorAst(data)
  }

  protected getStringTypeValidatorAst(data: SchemaObject): Expression {
    return factory.createCallExpression(this.getValidatorAst('string'), [], [])
  }

  protected getNumberTypeValidatorAst(data: SchemaObject): Expression {
    return factory.createCallExpression(this.getValidatorAst('number'), [], [])
  }
  protected getBooleanTypeValidatorAst(data: SchemaObject): Expression {
    return factory.createCallExpression(this.getValidatorAst('boolean'), [], [])
  }

  protected getUnknownTypeValidatorAst(data?: Referenceable<SchemaObject>): Expression {
    return factory.createCallExpression(this.getValidatorAst('any'), [], [])
  }

  protected getReferenceTypeValidatorAst(data: ReferenceObject): Expression {
    const resolved = this.context().dereference(data)
    if (this.context().hasName(resolved, this.name())) {
      const validator = factory.createIdentifier(this.context().nameOf(resolved, this.name()))
      return factory.createCallExpression(this.getValidatorAst('lazy'), undefined, [
        factory.createArrowFunction([], [], [], undefined, undefined, validator),
      ])
    }
    return this.getRightHandSideValidatorAst(resolved)
  }

  protected getUnionTypeValidatorAst(data: SchemaObject): Expression {
    const properties = (data.oneOf || []).map((item, index) =>
      factory.createPropertyAssignment(
        safeName(this.getUnionValidatorKey(item, index)),
        this.getRightHandSideValidatorAst(item),
      ),
    )
    const parameters = factory.createObjectLiteralExpression(properties, properties.length > 1)
    return factory.createCallExpression(this.getValidatorAst('union'), [], [parameters])
  }

  protected getUnionValidatorKey(data: Referenceable<SchemaObject>, schemaIndex: number): string {
    if (this.type.isReferenceObject(data)) {
      const schema = this.context().dereference(data)
      if (this.context().hasName(schema, 'oats/type')) {
        return this.context().nameOf(schema, 'oats/type')
      }
    } else {
      if (this.type.isStringSchema(data)) {
        return 'string'
      } else if (this.type.isNumberSchema(data)) {
        return 'number'
      } else if (this.type.isBooleanSchema(data)) {
        return 'boolean'
      }
    }
    return `_${schemaIndex}`
  }

  protected getEnumTypeValidatorAst(data: SchemaObject): Expression {
    const { enum: values = [] } = data
    if (values.length === 1) {
      return this.getJsonLiteralValidatorAst(values[0])
    }
    const properties = values.map((value) =>
      factory.createPropertyAssignment(this.getSafePropertyKey(value), this.getJsonLiteralValidatorAst(value)),
    )
    const parameters = factory.createObjectLiteralExpression(properties, properties.length > 1)
    return factory.createCallExpression(this.getValidatorAst('union'), [], [parameters])
  }

  protected getSafePropertyKey(value: any) {
    if (value === null) {
      return safeName('null')
    } else if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
      return safeName(`${value}`)
    }
    // TODO what do here?
    return safeName(JSON.stringify(value))
  }

  protected getJsonLiteralValidatorAst(data: any): Expression {
    if (data === null) {
      return factory.createCallExpression(this.getValidatorAst('literal'), [], [factory.createNull()])
    } else if (typeof data === 'string') {
      return factory.createCallExpression(this.getValidatorAst('literal'), [], [factory.createStringLiteral(data)])
    } else if (typeof data === 'number') {
      return factory.createCallExpression(this.getValidatorAst('literal'), [], [factory.createNumericLiteral(data)])
    } else if (typeof data === 'boolean') {
      return factory.createCallExpression(
        this.getValidatorAst('literal'),
        [],
        [data ? factory.createTrue() : factory.createFalse()],
      )
    } else if (Array.isArray(data)) {
      const parameters = data.map((value) => this.getJsonLiteralValidatorAst(value))
      return factory.createCallExpression(
        this.getValidatorAst('array'),
        [],
        [factory.createCallExpression(this.getValidatorAst('tuple'), [], parameters)],
      )
    } else if (typeof data === 'object') {
      const properties = entries(data).map(([key, value]) =>
        factory.createPropertyAssignment(safeName(key), this.getJsonLiteralValidatorAst(value)),
      )
      return factory.createCallExpression(
        this.getValidatorAst('object'),
        [],
        [
          factory.createCallExpression(
            this.getValidatorAst('shape'),
            [],
            [factory.createObjectLiteralExpression(properties, properties.length > 1)],
          ),
        ],
      )
    }
    return factory.createCallExpression(this.getValidatorAst('any'), [], [])
  }

  protected getLiteralTypeValidatorAst(data: SchemaObject): Expression {
    return this.getJsonLiteralValidatorAst(data.const)
  }

  protected getIntersectionTypeValidatorAst(data: SchemaObject): Expression {
    const discriminators = getDiscriminators(data, this.context()) ?? {}
    const discriminatorProperties = this.getDiscriminatorPropertyAsts(discriminators)
    const parameters = [
      ...(data.allOf || []).map((item) => this.getRightHandSideValidatorAst(item)),
      ...(discriminatorProperties.length > 0
        ? [
            factory.createCallExpression(
              this.getValidatorAst('object'),
              [],
              [
                factory.createCallExpression(
                  this.getValidatorAst('shape'),
                  [],
                  [factory.createObjectLiteralExpression(discriminatorProperties, discriminatorProperties.length > 1)],
                ),
              ],
            ),
          ]
        : []),
    ]
    return factory.createCallExpression(this.getValidatorAst('combine'), [], parameters)
  }

  protected getRecordTypeValidatorAst(data: SchemaObject): Expression {
    const addPropsSchema = data.additionalProperties
    const params = factory.createCallExpression(
      this.getValidatorAst('record'),
      [],
      [
        factory.createCallExpression(this.getValidatorAst('string'), [], []),
        typeof addPropsSchema === 'boolean'
          ? this.getUnknownTypeValidatorAst()
          : this.getRightHandSideValidatorAst(addPropsSchema!),
      ],
    )
    return factory.createCallExpression(
      this.getValidatorAst('object'),
      [],
      typeof addPropsSchema !== 'boolean' && this.configuration().ignore(addPropsSchema!, this.helper) ? [] : [params],
    )
  }

  protected getObjectTypeValidatorAst(data: SchemaObject): Expression {
    const discriminators = getDiscriminators(data, this.context()) ?? {}
    const discriminatorProperties = this.getDiscriminatorPropertyAsts(discriminators)

    const basicProperties = sortBy(entries(data.properties ?? {}), ([name]) => name)
      .filter(([name]) => !has(discriminators, name))
      .map(([name, schema]) => {
        const isOptional = (data.required ?? []).indexOf(name) < 0
        const rhs = this.getRightHandSideValidatorAst(schema)
        const value = isOptional ? factory.createCallExpression(this.getValidatorAst('optional'), [], [rhs]) : rhs
        return factory.createPropertyAssignment(safeName(name), value)
      })

    const properties = discriminatorProperties.concat(basicProperties)

    return factory.createCallExpression(
      this.getValidatorAst('object'),
      [],
      [
        factory.createCallExpression(
          this.getValidatorAst('shape'),
          [],
          [factory.createObjectLiteralExpression(properties, properties.length > 1)],
        ),
      ],
    )
  }

  protected getDiscriminatorPropertyAsts(discriminators: Record<string, string>) {
    return sortBy(entries(discriminators), ([name]) => name).map(([name, value]) =>
      factory.createPropertyAssignment(
        safeName(name),
        factory.createCallExpression(this.getValidatorAst('literal'), [], [factory.createStringLiteral(value)]),
      ),
    )
  }

  protected getArrayTypeValidatorAst(data: SchemaObject): Expression {
    const itemsSchema = data.items as Referenceable<SchemaObject>
    const itemsValidator = factory.createCallExpression(
      this.getValidatorAst('items'),
      [],
      [this.getRightHandSideValidatorAst(itemsSchema)],
    )
    return factory.createCallExpression(
      this.getValidatorAst('array'),
      [],
      this.configuration().ignore(itemsSchema, this.helper) ? [] : [itemsValidator],
    )
  }

  protected getTupleTypeValidatorAst(data: SchemaObject): Expression {
    const { prefixItems = [], minItems = 0 } = data
    const parameters = prefixItems.map((item, index) => {
      const validator = this.getRightHandSideValidatorAst(item)
      return index < minItems
        ? validator
        : factory.createCallExpression(this.getValidatorAst('optional'), [], [validator])
    })
    return factory.createCallExpression(
      this.getValidatorAst('array'),
      [],
      [factory.createCallExpression(this.getValidatorAst('tuple'), [], parameters)],
    )
  }

  protected getValidatorAst(type: keyof ValidatorsPackage['content']['validators']): Expression {
    const pkg = this.getValidatorPackage()
    return factory.createPropertyAccessExpression(
      factory.createIdentifier(pkg.exports.validators),
      pkg.content.validators[type],
    )
  }
}
