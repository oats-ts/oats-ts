import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { isNil } from 'lodash'
import { ValidatorImportProviderData } from './typings'
import { ValidatorImportProviderImpl } from './ValidatorImportProviderImpl'

export class ExternalRefValidatorImportProviderImpl extends ValidatorImportProviderImpl {
  protected override collectImports(data: Referenceable<SchemaObject>, d: ValidatorImportProviderData): void {
    const schema = this.context.dereference(data)
    if (!isNil(this.context.nameOf(schema))) {
      d.needsValidatorImport = true
      d.referenceImports.add(this.context.uriOf(schema))
    } else {
      super.collectImports(schema, d)
    }
  }
}
