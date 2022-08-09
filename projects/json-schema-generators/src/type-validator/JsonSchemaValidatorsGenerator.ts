import { isNil } from 'lodash'
import { RuntimePackages } from '@oats-ts/model-common'
import { ValidatorsGeneratorConfig } from './typings'
import { Expression, ImportDeclaration, factory, SourceFile } from 'typescript'
import { SchemaObject, Referenceable } from '@oats-ts/json-schema-model'
import { collectExternalReferenceImports, getValidatorImports } from './getValidatorImports'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { success, Try } from '@oats-ts/try'
import { createSourceFile } from '@oats-ts/typescript-common'
import { getValidatorAst } from './getValidatorAst'
import { JsonSchemaGeneratorTarget, JsonSchemaReadOutput } from '../types'
import { SchemaBasedCodeGenerator } from '../SchemaBasedCodeGenerator'

export class JsonSchemaValidatorsGenerator<T extends JsonSchemaReadOutput> extends SchemaBasedCodeGenerator<
  T,
  ValidatorsGeneratorConfig
> {
  public name(): JsonSchemaGeneratorTarget {
    return 'oats/type-validator'
  }

  public consumes(): JsonSchemaGeneratorTarget[] {
    return ['oats/type']
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Validators.name]
  }

  protected shouldGenerate(schema: Referenceable<SchemaObject>): boolean {
    if (isNil(this.config?.ignore)) {
      return true
    }
    return !this.config.ignore(schema, this.context.uriOf(schema))
  }

  public referenceOf(input: Referenceable<SchemaObject>): Expression {
    const schema = this.context.dereference(input)
    const name = this.context.nameOf(schema)
    return isNil(name)
      ? getRightHandSideValidatorAst(input, this.context, this.config)
      : factory.createIdentifier(this.context.nameOf(schema, 'oats/type-validator'))
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return getValidatorImports(fromPath, input, this.context, this.config, collectExternalReferenceImports)
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, 'oats/type-validator')
    return success(
      createSourceFile(path, getValidatorImports(path, schema, this.context, this.config), [
        getValidatorAst(schema, this.context, this.config),
      ]),
    )
  }
}
