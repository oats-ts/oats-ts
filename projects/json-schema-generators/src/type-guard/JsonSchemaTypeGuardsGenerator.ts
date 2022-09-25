import { isNil } from 'lodash'
import { TypeGuardGeneratorConfig } from './typings'
import { ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { success, Try } from '@oats-ts/try'
import { getTypeGuardImports } from './getTypeGuardImports'
import { getTypeGuardFunctionAst } from './getTypeGuardFunctionAst'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { SchemaBasedCodeGenerator } from '../SchemaBasedCodeGenerator'
import { JsonSchemaGeneratorTarget, JsonSchemaReadOutput } from '../types'
import { RuntimeDependency } from '@oats-ts/oats-ts'

export class JsonSchemaTypeGuardsGenerator<T extends JsonSchemaReadOutput> extends SchemaBasedCodeGenerator<
  T,
  TypeGuardGeneratorConfig
> {
  public name(): JsonSchemaGeneratorTarget {
    return 'oats/type-guard'
  }

  public consumes(): JsonSchemaGeneratorTarget[] {
    return ['oats/type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  protected shouldGenerate(schema: Referenceable<SchemaObject>): boolean {
    const config = this.configuration()
    if (isNil(config?.ignore)) {
      return true
    }
    return !config.ignore(schema, this.context.uriOf(schema))
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, 'oats/type-guard')
    const typeImports = this.context.dependenciesOf(path, schema, 'oats/type')
    return success(
      createSourceFile(
        path,
        [...typeImports, ...getTypeGuardImports(schema, this.context, this.configuration())],
        [
          getTypeGuardFunctionAst(
            schema,
            this.context,
            getTypeAssertionAst(schema, this.context, factory.createIdentifier('input'), this.configuration(), 0),
          ),
        ],
      ),
    )
  }

  public referenceOf(input: any) {
    return isNil(this.context.nameOf(input))
      ? undefined
      : factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }
}
