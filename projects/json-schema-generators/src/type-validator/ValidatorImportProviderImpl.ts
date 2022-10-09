import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getDiscriminators, RuntimePackages } from '@oats-ts/model-common'
import { getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { entries, isEmpty, isNil, values } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget, TraversalHelper, TypeDiscriminator } from '../types'
import { ValidatorImportProvider, ValidatorsGeneratorConfig } from './typings'

export class ValidatorImportProviderImpl implements ValidatorImportProvider {
  public constructor(
    protected readonly context: JsonSchemaGeneratorContext,
    protected readonly config: ValidatorsGeneratorConfig,
    protected readonly helper: TraversalHelper,
    protected readonly type: TypeDiscriminator,
  ) {}

  protected collectReferenceTypeImports(
    data: ReferenceObject,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    const schema = this.context.dereference(data)
    if (!isNil(this.context.nameOf(schema, 'oats/type-validator'))) {
      validatorImports.add(RuntimePackages.Validators.lazy)
      referenceImports.add(data.$ref)
    } else {
      this.collectImports(schema, validatorImports, referenceImports)
    }
  }

  protected collectUnionTypeImports(
    data: SchemaObject,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    validatorImports.add(RuntimePackages.Validators.union)
    if (!isNil(data.discriminator)) {
      for (const schemaOrRef of data.oneOf ?? []) {
        this.collectImports(schemaOrRef, validatorImports, referenceImports)
      }
      if ((data.oneOf?.length ?? 0) > 0) {
        validatorImports.add(RuntimePackages.Validators.lazy)
      }
    } else {
      for (const schemaOrRef of data.oneOf ?? []) {
        this.collectImports(schemaOrRef, validatorImports, referenceImports)
      }
    }
  }

  protected collectIntersectionTypeImports(
    data: SchemaObject,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    validatorImports.add(RuntimePackages.Validators.combine)
    for (const schemaOrRef of data.allOf ?? []) {
      this.collectImports(schemaOrRef, validatorImports, referenceImports)
    }
  }

  protected collectJsonLiteralImports(data: any, validatorImports: Set<string>, referenceImports: Set<string>): void {
    if (data === null || typeof data === 'number' || typeof data === 'boolean' || typeof data === 'string') {
      validatorImports.add(RuntimePackages.Validators.literal)
    } else if (Array.isArray(data)) {
      validatorImports.add(RuntimePackages.Validators.array).add(RuntimePackages.Validators.tuple)
      data.forEach((item: any) => this.collectJsonLiteralImports(item, validatorImports, referenceImports))
    } else if (typeof data === 'object') {
      validatorImports.add(RuntimePackages.Validators.object).add(RuntimePackages.Validators.shape)
      values(data).forEach((item) => this.collectJsonLiteralImports(item, validatorImports, referenceImports))
    } else {
      validatorImports.add(RuntimePackages.Validators.any)
    }
  }

  protected collectEnumTypeImports(data: any, validatorImports: Set<string>, referenceImports: Set<string>): void {
    validatorImports.add(RuntimePackages.Validators.union)
    data.enum?.forEach((value: any) => this.collectJsonLiteralImports(value, validatorImports, referenceImports))
  }

  protected collectLiteralTypeImports(data: any, validatorImports: Set<string>, referenceImports: Set<string>): void {
    this.collectJsonLiteralImports(data.const, validatorImports, referenceImports)
  }

  protected collectStringTypeImports(data: any, validatorImports: Set<string>, referenceImports: Set<string>): void {
    validatorImports.add(RuntimePackages.Validators.string)
  }

  protected collectNumberTypeImports(data: any, validatorImports: Set<string>, referenceImports: Set<string>): void {
    validatorImports.add(RuntimePackages.Validators.number)
  }

  protected collectBooleanTypeImports(data: any, validatorImports: Set<string>, referenceImports: Set<string>): void {
    validatorImports.add(RuntimePackages.Validators.boolean)
  }

  protected collectRecordTypeImports(
    data: SchemaObject,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    validatorImports.add(RuntimePackages.Validators.object)
    if (!this.config.ignore(data.additionalProperties as Referenceable<SchemaObject>, this.helper)) {
      validatorImports.add(RuntimePackages.Validators.record)
      validatorImports.add(RuntimePackages.Validators.string)
      this.collectImports(data.additionalProperties as Referenceable<SchemaObject>, validatorImports, referenceImports)
    }
  }

  protected collectArrayTypeImports(
    data: SchemaObject,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    validatorImports.add(RuntimePackages.Validators.array)
    if (!this.config.ignore(data.items as Referenceable<SchemaObject>, this.helper)) {
      validatorImports.add(RuntimePackages.Validators.items)
      this.collectImports(data.items as Referenceable<SchemaObject>, validatorImports, referenceImports)
    }
  }

  protected collectTupleTypeImports(
    data: SchemaObject,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    const { prefixItems = [], minItems = 0 } = data
    if (minItems < prefixItems.length) {
      validatorImports.add(RuntimePackages.Validators.optional)
    }
    validatorImports.add(RuntimePackages.Validators.array)
    validatorImports.add(RuntimePackages.Validators.tuple)
    return prefixItems.forEach((item) => this.collectImports(item, validatorImports, referenceImports))
  }

  protected collectObjectTypeImports(
    data: SchemaObject,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    const discriminators = getDiscriminators(data, this.context)
    if (values(discriminators).length > 0) {
      validatorImports.add(RuntimePackages.Validators.literal)
    }
    validatorImports.add(RuntimePackages.Validators.object).add(RuntimePackages.Validators.shape)
    for (const [name, propSchema] of entries(data.properties)) {
      const isOptional = (data.required || []).indexOf(name) < 0
      if (isOptional) {
        validatorImports.add(RuntimePackages.Validators.optional)
      }
      this.collectImports(propSchema, validatorImports, referenceImports)
    }
  }

  protected collectUnknownTypeImports(
    data: Referenceable<SchemaObject> | undefined,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ) {
    validatorImports.add(RuntimePackages.Validators.any)
  }

  protected collectImports(
    data: Referenceable<SchemaObject>,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    if (this.config.ignore(data, this.helper)) {
      return this.collectUnknownTypeImports(data, validatorImports, referenceImports)
    }
    if (this.type.isReferenceObject(data)) {
      return this.collectReferenceTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isUnionSchema(data)) {
      return this.collectUnionTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isIntersectionSchema(data)) {
      return this.collectIntersectionTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isEnumSchema(data)) {
      return this.collectEnumTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isLiteralSchema(data)) {
      return this.collectLiteralTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isStringSchema(data)) {
      return this.collectStringTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isNumberSchema(data)) {
      return this.collectNumberTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isBooleanSchema(data)) {
      return this.collectBooleanTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isRecordSchema(data)) {
      return this.collectRecordTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isObjectSchema(data)) {
      return this.collectObjectTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isArraySchema(data)) {
      return this.collectArrayTypeImports(data, validatorImports, referenceImports)
    } else if (this.type.isTupleSchema(data)) {
      return this.collectTupleTypeImports(data, validatorImports, referenceImports)
    }
    return this.collectUnknownTypeImports(data, validatorImports, referenceImports)
  }

  public getImports(fromPath: string, schema: Referenceable<SchemaObject>): ImportDeclaration[] {
    const validatorImportSet = new Set<string>()
    const referenceImportSet = new Set<string>()
    this.collectImports(schema, validatorImportSet, referenceImportSet)
    const validatorImports = Array.from(validatorImportSet)
    const referenceImports = Array.from(referenceImportSet)
    return [
      ...(isEmpty(validatorImports) ? [] : [getNamedImports(RuntimePackages.Validators.name, validatorImports)]),
      ...getModelImports<JsonSchemaGeneratorTarget>(
        fromPath,
        'oats/type-validator',
        referenceImports.map((ref) => this.context.dereference<SchemaObject>(ref)),
        this.context,
      ),
    ]
  }
}