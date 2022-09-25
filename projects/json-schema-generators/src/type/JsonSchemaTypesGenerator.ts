import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { TypeNode, ImportDeclaration, SourceFile } from 'typescript'
import { TypesGeneratorConfig } from './typings'
import { getTypeImports } from './getTypeImports'
import { getExternalTypeReferenceAst } from './getExternalTypeReferenceAst'
import { success, Try } from '@oats-ts/try'
import { createSourceFile } from '@oats-ts/typescript-common'
import { getNamedTypeAst } from './getNamedTypeAst'
import { SchemaBasedCodeGenerator } from '../SchemaBasedCodeGenerator'
import { JsonSchemaGeneratorTarget, JsonSchemaReadOutput } from '../types'
import { RuntimeDependency } from '@oats-ts/oats-ts'

export class JsonSchemaTypesGenerator<T extends JsonSchemaReadOutput> extends SchemaBasedCodeGenerator<
  T,
  TypesGeneratorConfig
> {
  public name(): JsonSchemaGeneratorTarget {
    return 'oats/type'
  }

  public consumes(): JsonSchemaGeneratorTarget[] {
    return []
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  public referenceOf(input: Referenceable<SchemaObject>): TypeNode {
    return getExternalTypeReferenceAst(input, this.context, this.configuration())
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return getTypeImports(fromPath, input, this.context, true)
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, 'oats/type')
    return success(
      createSourceFile(path, getTypeImports(path, schema, this.context, false), [
        getNamedTypeAst(schema, this.context, this.configuration()),
      ]),
    )
  }
}
