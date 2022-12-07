import { entries, has, isNil, sortBy, values } from 'lodash'
import { TypeGuardGeneratorConfig } from './typings'
import { ImportDeclaration, factory, SourceFile, Expression, SyntaxKind, Statement } from 'typescript'
import {
  createSourceFile,
  getLogicalExpression,
  getModelImports,
  reduceLogicalExpressions,
  safeMemberAccess,
} from '@oats-ts/typescript-common'
import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { success, Try } from '@oats-ts/try'
import { RuntimeDependency } from '@oats-ts/oats-ts'
import { SchemaBasedCodeGenerator } from '../utils/SchemaBasedCodeGenerator'
import { getDiscriminators, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'

export class JsonSchemaTypeGuardsGenerator extends SchemaBasedCodeGenerator<TypeGuardGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/type-guard'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  public referenceOf(input: any) {
    return isNil(this.context().nameOf(input))
      ? undefined
      : factory.createIdentifier(this.context().nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return getModelImports(fromPath, this.id, [input], this.context())
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(schema, this.name())
    const typeImports = this.context().dependenciesOf<ImportDeclaration>(path, schema, 'oats/type')
    const assertion = this.getTopLevelTypeAssertionAst(schema, factory.createIdentifier(this.getInputParameterName()))
    return success(
      createSourceFile(
        path,
        [...typeImports, ...this.getTypeGuardImports(schema)],
        [this.getTypeGuardFunctionAst(schema, assertion)],
      ),
    )
  }

  protected getInputParameterName(expression?: Expression): string {
    return expression?.kind === SyntaxKind.TrueKeyword ? '_' : 'input'
  }

  protected getTypeGuardFunctionAst(schema: SchemaObject | ReferenceObject, assertion: Expression): Statement {
    const paramName = this.getInputParameterName(assertion)
    return factory.createFunctionDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      undefined,
      this.context().nameOf(schema, this.name()),
      [],
      [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          paramName,
          undefined,
          factory.createTypeReferenceNode('any'),
        ),
      ],
      factory.createTypePredicateNode(undefined, paramName, this.context().referenceOf(schema, 'oats/type')),
      factory.createBlock([factory.createReturnStatement(assertion)]),
    )
  }

  protected getTopLevelTypeAssertionAst(
    data: Referenceable<SchemaObject> | undefined,
    variable: Expression,
  ): Expression {
    if (isNil(data) || this.configuration().ignore(data, this.helper)) {
      // If a top level schema is ignored, the type guard will always return false.
      return factory.createFalse()
    }
    return this.getTypeAssertionAst(data, variable)
  }

  protected getTypeAssertionAst(data: Referenceable<SchemaObject> | undefined, variable: Expression): Expression {
    if (isNil(data) || this.configuration().ignore(data, this.helper)) {
      // If not a top level schema is ignored, the type guard part will always return true.
      return factory.createTrue()
    }

    if (this.type.isReferenceObject(data)) {
      return this.getReferenceAssertionAst(data, variable)
    } else if (this.type.isUnionSchema(data)) {
      return this.getUnionTypeAssertionAst(data, variable)
    } else if (this.type.isEnumSchema(data)) {
      return this.getEnumAssertionAst(data, variable)
    } else if (this.type.isLiteralSchema(data)) {
      return this.getLiteralTypeAssertionAst(data, variable)
    } else if (this.type.isIntersectionSchema(data)) {
      return this.getIntersectionTypeAssertionAst(data, variable)
    } else if (this.type.isStringSchema(data)) {
      return this.getStringTypeAssertionAst(data, variable)
    } else if (this.type.isNumberSchema(data)) {
      return this.getNumberTypeAssertionAst(data, variable)
    } else if (this.type.isBooleanSchema(data)) {
      return this.getBooleanTypeAssertionAst(data, variable)
    } else if (this.type.isRecordSchema(data)) {
      return this.getRecordTypeAssertionAst(data, variable)
    } else if (this.type.isObjectSchema(data)) {
      return this.getObjectTypeAssertionAst(data, variable)
    } else if (this.type.isArraySchema(data)) {
      return this.getArrayTypeAssertionAst(data, variable)
    } else if (this.type.isTupleSchema(data)) {
      return this.getTupleTypeAssertionAst(data, variable)
    }
    return this.getUnknownTypeAssertion(data, variable)
  }

  protected getReferenceAssertionAst(data: ReferenceObject, variable: Expression): Expression {
    const refTarget = this.context().dereference(data)
    const name = this.context().nameOf(refTarget, this.name())
    if (isNil(name)) {
      // Not increasing level here so named refs can be validated.
      return this.getTypeAssertionAst(refTarget, variable)
    }
    return factory.createAsExpression(
      factory.createCallExpression(factory.createIdentifier(name), [], [variable]),
      factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
    )
  }

  protected getUnionTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    if (isNil(data.discriminator)) {
      return reduceLogicalExpressions(
        SyntaxKind.BarBarToken,
        (data.oneOf ?? []).map((refOrSchema) => this.getTypeAssertionAst(refOrSchema, variable)),
      )
    }
    // Should be just schema objects at this point.
    return reduceLogicalExpressions(
      SyntaxKind.BarBarToken,
      (data.oneOf ?? []).map((refOrSchema) => {
        const schema = this.context().dereference<SchemaObject>(refOrSchema)
        return factory.createCallExpression(
          factory.createIdentifier(this.context().nameOf(schema, this.name())),
          [],
          [variable],
        )
      }),
    )
  }

  protected getEnumAssertionAst(data: SchemaObject, variable: Expression): Expression {
    return getLogicalExpression(
      SyntaxKind.BarBarToken,
      (data.enum ?? []).map((value) => this.getJsonLiteralAssertionAst(value, variable)),
    )
  }

  protected getLiteralTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    return this.getJsonLiteralAssertionAst(data.const, variable)
  }

  protected getJsonLiteralAssertionAst(data: any, variable: Expression): Expression {
    if (data === null) {
      return factory.createBinaryExpression(variable, SyntaxKind.EqualsEqualsEqualsToken, factory.createNull())
    } else if (typeof data === 'string') {
      return factory.createBinaryExpression(
        variable,
        SyntaxKind.EqualsEqualsEqualsToken,
        factory.createStringLiteral(data),
      )
    } else if (typeof data === 'number') {
      return factory.createBinaryExpression(
        variable,
        SyntaxKind.EqualsEqualsEqualsToken,
        factory.createNumericLiteral(data),
      )
    } else if (typeof data === 'boolean') {
      return factory.createBinaryExpression(
        variable,
        SyntaxKind.EqualsEqualsEqualsToken,
        data ? factory.createTrue() : factory.createFalse(),
      )
    } else if (Array.isArray(data)) {
      const expressions: Expression[] = [
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('Array'),
            factory.createIdentifier('isArray'),
          ),
          undefined,
          [variable],
        ),
        ...data.map((item, index) =>
          this.getJsonLiteralAssertionAst(
            item,
            factory.createElementAccessExpression(variable, factory.createNumericLiteral(index)),
          ),
        ),
      ]
      return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
    } else if (typeof data === 'object') {
      const expressions: Expression[] = [
        factory.createBinaryExpression(
          factory.createTypeOfExpression(variable),
          SyntaxKind.EqualsEqualsEqualsToken,
          factory.createStringLiteral('object'),
        ),
        factory.createBinaryExpression(
          factory.createTypeOfExpression(variable),
          SyntaxKind.ExclamationEqualsEqualsToken,
          factory.createNull(),
        ),
        ...entries(data).map(([key, value]) => this.getJsonLiteralAssertionAst(value, safeMemberAccess(variable, key))),
      ]
      return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
    }
    return factory.createTrue()
  }

  protected getIntersectionTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    const { allOf = [] } = data
    const expressions = allOf.map((item) => this.getTypeAssertionAst(item, variable))
    return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
  }

  protected getStringTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    return factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('string'),
    )
  }

  protected getNumberTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    return factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('number'),
    )
  }

  protected getBooleanTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    return factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('boolean'),
    )
  }

  protected getRecordTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    const propsSchema = data.additionalProperties as Referenceable<SchemaObject>
    const expressions: Expression[] = [
      factory.createBinaryExpression(variable, SyntaxKind.ExclamationEqualsEqualsToken, factory.createNull()),
      factory.createBinaryExpression(
        factory.createTypeOfExpression(variable),
        SyntaxKind.EqualsEqualsEqualsToken,
        factory.createStringLiteral('object'),
      ),
      ...(this.configuration().ignore(propsSchema, this.helper)
        ? []
        : [this.getRecordItemsAsserterAst(data, variable)]),
    ]
    return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
  }

  protected getRecordItemsAsserterAst(data: SchemaObject, variable: Expression): Expression {
    const keyVar = factory.createIdentifier('key')
    const itemAssertion = this.getTypeAssertionAst(
      data.additionalProperties as SchemaObject | ReferenceObject,
      factory.createElementAccessExpression(variable, keyVar),
    )

    if (itemAssertion.kind === SyntaxKind.TrueKeyword) {
      return factory.createTrue()
    }

    const arrowFn = factory.createArrowFunction(
      undefined,
      undefined,
      [factory.createParameterDeclaration(undefined, undefined, undefined, keyVar)],
      undefined,
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      itemAssertion,
    )

    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier('Object'), factory.createIdentifier('keys')),
          undefined,
          [variable],
        ),
        factory.createIdentifier('every'),
      ),
      undefined,
      [arrowFn],
    )
  }

  protected getObjectTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    const discriminators = getDiscriminators(data, this.context()) || {}
    const discriminatorAssertions = sortBy(entries(discriminators), ([name]) => name).map(([name, value]) => {
      return factory.createBinaryExpression(
        safeMemberAccess(variable, name),
        SyntaxKind.EqualsEqualsEqualsToken,
        factory.createStringLiteral(value),
      )
    })
    const propertyAssertions = sortBy(entries(data.properties ?? {}), ([name]) => name)
      .filter(([name]) => !has(discriminators, name))
      .map(([name, schemaOrRef]) => {
        const memberVar = safeMemberAccess(variable, name)
        const assertion = this.getTypeAssertionAst(schemaOrRef, memberVar)
        if (assertion.kind === SyntaxKind.TrueKeyword) {
          return assertion
        }
        const isOptional: boolean = (data.required || []).indexOf(name) < 0
        return isOptional
          ? getLogicalExpression(SyntaxKind.BarBarToken, [
              factory.createBinaryExpression(memberVar, SyntaxKind.EqualsEqualsEqualsToken, factory.createNull()),
              factory.createBinaryExpression(
                memberVar,
                SyntaxKind.EqualsEqualsEqualsToken,
                factory.createIdentifier('undefined'),
              ),
              assertion,
            ])
          : assertion
      })

    const expressions: Expression[] = [
      factory.createBinaryExpression(variable, SyntaxKind.ExclamationEqualsEqualsToken, factory.createNull()),
      factory.createBinaryExpression(
        factory.createTypeOfExpression(variable),
        SyntaxKind.EqualsEqualsEqualsToken,
        factory.createStringLiteral('object'),
      ),
      ...discriminatorAssertions,
      ...propertyAssertions,
    ]

    return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
  }

  protected getArrayTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    const itemsSchema = data.items as Referenceable<SchemaObject>
    const expressions: Expression[] = [
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('isArray')),
        undefined,
        [variable],
      ),
      ...(this.configuration().ignore(itemsSchema, this.helper) ? [] : [this.getArrayItemAsserterAst(data, variable)]),
    ]
    return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
  }

  protected getArrayItemAsserterAst(data: SchemaObject, variable: Expression): Expression {
    if (typeof data.items === 'boolean') {
      return factory.createTrue()
    }
    const itemAssertion = this.getTypeAssertionAst(data.items, factory.createIdentifier('item'))
    if (itemAssertion.kind === SyntaxKind.TrueKeyword) {
      return factory.createTrue()
    }
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(variable, factory.createIdentifier('every')),
      undefined,
      [
        factory.createArrowFunction(
          undefined,
          undefined,
          [
            factory.createParameterDeclaration(
              [],
              [],
              undefined,
              factory.createIdentifier('item'),
              undefined,
              factory.createTypeReferenceNode('any'),
            ),
          ],
          undefined,
          factory.createToken(SyntaxKind.EqualsGreaterThanToken),
          itemAssertion,
        ),
      ],
    )
  }

  protected getTupleTypeAssertionAst(data: SchemaObject, variable: Expression): Expression {
    const { prefixItems = [], minItems = 0 } = data
    const isArrayExpression = factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('isArray')),
      undefined,
      [variable],
    )
    const expressions = prefixItems.map((item, index) => {
      const itemAst = factory.createElementAccessExpression(variable, factory.createNumericLiteral(index))
      const itemAssert = this.getTypeAssertionAst(item, itemAst)
      if (index < minItems) {
        return itemAssert
      }
      return reduceLogicalExpressions(SyntaxKind.BarBarToken, [
        factory.createBinaryExpression(itemAst, SyntaxKind.EqualsEqualsEqualsToken, factory.createNull()),
        factory.createBinaryExpression(
          itemAst,
          SyntaxKind.EqualsEqualsEqualsToken,
          factory.createIdentifier('undefined'),
        ),
        itemAssert,
      ])
    })
    return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, [isArrayExpression, ...expressions])
  }

  protected getUnknownTypeAssertion(data: SchemaObject, variable: Expression) {
    return factory.createTrue()
  }

  protected getTypeGuardImports(data: Referenceable<SchemaObject>): ImportDeclaration[] {
    const refs = new Set<ReferenceObject>()
    this.collectImportedTypeGuardRefs(data, refs)

    const importedSchemas = sortBy(
      Array.from(refs).map((ref) => this.context().dereference<SchemaObject>(ref)),
      (schema) => this.context().nameOf(schema, this.name()),
    )
    const path = this.context().pathOf(data, this.name())
    return isNil(path) ? [] : getModelImports(path, this.name(), importedSchemas, this.context())
  }

  private collectImportedTypeGuardRefs(data: Referenceable<SchemaObject>, refs: Set<ReferenceObject>): void {
    if (this.configuration().ignore(data, this.helper)) {
      return
    }
    if (this.type.isReferenceObject(data)) {
      const refTarget = this.context().dereference(data)
      const name = this.context().nameOf(refTarget, this.name())
      if (isNil(name)) {
        this.collectImportedTypeGuardRefs(refTarget, refs)
      } else {
        refs.add(data)
      }
      return
    }

    if (this.type.isUnionSchema(data)) {
      for (const oneOfItemSchema of data.oneOf!) {
        this.collectImportedTypeGuardRefs(oneOfItemSchema, refs)
      }
      return
    }

    if (this.type.isIntersectionSchema(data)) {
      for (const allOfItemSchema of data.allOf!) {
        this.collectImportedTypeGuardRefs(allOfItemSchema, refs)
      }
      return
    }

    if (this.type.isRecordSchema(data)) {
      return this.collectImportedTypeGuardRefs(data.additionalProperties as Referenceable<SchemaObject>, refs)
    }

    if (this.type.isObjectSchema(data)) {
      for (const propSchema of values(data.properties)) {
        this.collectImportedTypeGuardRefs(propSchema, refs)
      }
      return
    }

    if (this.type.isTupleSchema(data)) {
      return data.prefixItems!.forEach((item) => this.collectImportedTypeGuardRefs(item, refs))
    }

    if (this.type.isArraySchema(data)) {
      return this.collectImportedTypeGuardRefs(data.items as Referenceable<SchemaObject>, refs)
    }
  }
}
