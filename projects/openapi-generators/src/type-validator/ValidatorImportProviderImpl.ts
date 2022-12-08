import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget, ValidatorsPackage } from '@oats-ts/openapi-common'
import { getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { entries, isNil } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { TraversalHelper, TypeDiscriminator } from '../types'
import { ValidatorImportProvider, ValidatorImportProviderData, ValidatorsGeneratorConfig } from './typings'

export class ValidatorImportProviderImpl implements ValidatorImportProvider {
  public constructor(
    protected readonly context: OpenAPIGeneratorContext,
    protected readonly config: ValidatorsGeneratorConfig,
    protected readonly helper: TraversalHelper,
    protected readonly type: TypeDiscriminator,
    protected readonly pkg: ValidatorsPackage,
  ) {}

  protected collectReferenceTypeImports(data: ReferenceObject, d: ValidatorImportProviderData): void {
    const schema = this.context.dereference(data)
    if (this.context.hasName(schema, 'oats/type-validator')) {
      d.needsValidatorImport = true
      d.referenceImports.add(data.$ref)
    } else {
      this.collectImports(schema, d)
    }
  }

  protected collectUnionTypeImports(data: SchemaObject, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true

    if (!isNil(data.discriminator)) {
      for (const schemaOrRef of data.oneOf ?? []) {
        this.collectImports(schemaOrRef, d)
      }
    } else {
      for (const schemaOrRef of data.oneOf ?? []) {
        this.collectImports(schemaOrRef, d)
      }
    }
  }

  protected collectIntersectionTypeImports(data: SchemaObject, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
    for (const schemaOrRef of data.allOf ?? []) {
      this.collectImports(schemaOrRef, d)
    }
  }

  protected collectJsonLiteralImports(data: any, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
  }

  protected collectEnumTypeImports(data: any, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
  }

  protected collectLiteralTypeImports(data: any, d: ValidatorImportProviderData): void {
    this.collectJsonLiteralImports(data.const, d)
  }

  protected collectStringTypeImports(data: any, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
  }

  protected collectNumberTypeImports(data: any, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
  }

  protected collectBooleanTypeImports(data: any, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
  }

  protected collectRecordTypeImports(data: SchemaObject, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
    if (!this.config.ignore(data.additionalProperties as Referenceable<SchemaObject>, this.helper)) {
      this.collectImports(data.additionalProperties as Referenceable<SchemaObject>, d)
    }
  }

  protected collectArrayTypeImports(data: SchemaObject, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
    if (!this.config.ignore(data.items as Referenceable<SchemaObject>, this.helper)) {
      this.collectImports(data.items as Referenceable<SchemaObject>, d)
    }
  }

  protected collectTupleTypeImports(data: SchemaObject, d: ValidatorImportProviderData): void {
    const { prefixItems = [] } = data
    d.needsValidatorImport = true
    prefixItems.forEach((item) => this.collectImports(item, d))
  }

  protected collectObjectTypeImports(data: SchemaObject, d: ValidatorImportProviderData): void {
    d.needsValidatorImport = true
    for (const [_, propSchema] of entries(data.properties)) {
      this.collectImports(propSchema, d)
    }
  }

  protected collectUnknownTypeImports(data: Referenceable<SchemaObject> | undefined, d: ValidatorImportProviderData) {
    d.needsValidatorImport = true
  }

  protected collectImports(data: Referenceable<SchemaObject>, d: ValidatorImportProviderData): void {
    if (this.config.ignore(data, this.helper)) {
      return this.collectUnknownTypeImports(data, d)
    }
    if (this.type.isReferenceObject(data)) {
      return this.collectReferenceTypeImports(data, d)
    } else if (this.type.isUnionSchema(data)) {
      return this.collectUnionTypeImports(data, d)
    } else if (this.type.isIntersectionSchema(data)) {
      return this.collectIntersectionTypeImports(data, d)
    } else if (this.type.isEnumSchema(data)) {
      return this.collectEnumTypeImports(data, d)
    } else if (this.type.isLiteralSchema(data)) {
      return this.collectLiteralTypeImports(data, d)
    } else if (this.type.isStringSchema(data)) {
      return this.collectStringTypeImports(data, d)
    } else if (this.type.isNumberSchema(data)) {
      return this.collectNumberTypeImports(data, d)
    } else if (this.type.isBooleanSchema(data)) {
      return this.collectBooleanTypeImports(data, d)
    } else if (this.type.isRecordSchema(data)) {
      return this.collectRecordTypeImports(data, d)
    } else if (this.type.isObjectSchema(data)) {
      return this.collectObjectTypeImports(data, d)
    } else if (this.type.isArraySchema(data)) {
      return this.collectArrayTypeImports(data, d)
    } else if (this.type.isTupleSchema(data)) {
      return this.collectTupleTypeImports(data, d)
    }
    return this.collectUnknownTypeImports(data, d)
  }

  public getImports(fromPath: string, schema: Referenceable<SchemaObject>): ImportDeclaration[] {
    const data: ValidatorImportProviderData = { needsValidatorImport: false, referenceImports: new Set<string>() }
    this.collectImports(schema, data)
    const referenceImports = Array.from(data.referenceImports)
    return [
      ...(data.needsValidatorImport ? [getNamedImports(this.pkg.name, [this.pkg.imports.validators])] : []),
      ...getModelImports<OpenAPIGeneratorTarget>(
        fromPath,
        'oats/type-validator',
        referenceImports.map((ref) => this.context.dereference<SchemaObject>(ref)),
        this.context,
      ),
    ]
  }
}
