import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { RuntimePackages } from '@oats-ts/model-common'
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
      validatorImports.add(RuntimePackages.Validators.lazy)
      referenceImports.add(this.context.uriOf(schema))
    } else {
      super.collectImports(schema, validatorImports, referenceImports)
    }
  }
}
