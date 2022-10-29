import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { isNil } from 'lodash'
import { ValidatorImportProviderImpl } from './ValidatorImportProviderImpl'

export class ExternalRefValidatorImportProviderImpl extends ValidatorImportProviderImpl {
  protected override collectImports(
    data: Referenceable<SchemaObject>,
    validatorImports: Set<string>,
    referenceImports: Set<string>,
  ): void {
    const schema = this.context.dereference(data)
    if (!isNil(this.context.nameOf(schema))) {
      validatorImports.add(this.pkg.exports.validators)
      referenceImports.add(this.context.uriOf(schema))
    } else {
      super.collectImports(schema, validatorImports, referenceImports)
    }
  }
}
