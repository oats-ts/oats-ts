import { isNil } from 'lodash'
import { RuntimePackages } from '@oats-ts/model-common'
import { ValidatorsGeneratorConfig } from './typings'
import { Expression, ImportDeclaration, SourceFile } from 'typescript'
import { SchemaObject, Referenceable } from '@oats-ts/json-schema-model'
import { collectExternalReferenceImports, getValidatorImports } from './getValidatorImports'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { success, Try } from '@oats-ts/try'
import { createSourceFile } from '@oats-ts/typescript-common'
import { getValidatorAst } from './getValidatorAst'
import { JsonSchemaGeneratorTarget, JsonSchemaReadOutput, TraversalHelper } from '../types'
import { SchemaBasedCodeGenerator } from '../SchemaBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { TraversalHelperImpl } from '../TraversalHelperImpl'

export class JsonSchemaValidatorsGenerator<T extends JsonSchemaReadOutput> extends SchemaBasedCodeGenerator<
  T,
  ValidatorsGeneratorConfig
> {
  private helper!: TraversalHelper

  public name(): JsonSchemaGeneratorTarget {
    return 'oats/type-validator'
  }

  public consumes(): JsonSchemaGeneratorTarget[] {
    return ['oats/type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Validators.name, version }]
  }

  protected preGenerate(): void {
    this.helper = new TraversalHelperImpl(this.context)
  }

  protected shouldGenerate(schema: Referenceable<SchemaObject>): boolean {
    const config = this.configuration()
    if (isNil(config?.ignore)) {
      return true
    }
    return !config.ignore(schema, this.helper)
  }

  public referenceOf(input: Referenceable<SchemaObject>): Expression {
    return getRightHandSideValidatorAst(input, this.context, this.configuration(), this.helper)
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return getValidatorImports(
      fromPath,
      input,
      this.context,
      this.configuration(),
      this.helper,
      collectExternalReferenceImports,
    )
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, 'oats/type-validator')
    return success(
      createSourceFile(path, getValidatorImports(path, schema, this.context, this.configuration(), this.helper), [
        getValidatorAst(schema, this.context, this.configuration(), this.helper),
      ]),
    )
  }
}
