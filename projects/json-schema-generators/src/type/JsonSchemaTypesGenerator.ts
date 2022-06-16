import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'
import { TypeNode, ImportDeclaration, SourceFile } from 'typescript'
import { TypesGeneratorConfig } from './typings'
import { getTypeImports } from './getTypeImports'
import { getExternalTypeReferenceAst } from './getExternalTypeReferenceAst'
import { success, Try } from '@oats-ts/try'
import { createSourceFile } from '@oats-ts/typescript-common'
import { getNamedTypeAst } from './getNamedTypeAst'
import { SchemaBasedCodeGenerator } from '../SchemaBasedCodeGenerator'
import { JsonSchemaReadOutput } from '../types'

export class JsonSchemaTypesGenerator<T extends JsonSchemaReadOutput> extends SchemaBasedCodeGenerator<
  T,
  TypesGeneratorConfig
> {
  public name(): JsonSchemaGeneratorTarget {
    return 'json-schema/type'
  }

  public consumes(): JsonSchemaGeneratorTarget[] {
    return []
  }

  public runtimeDependencies(): string[] {
    return []
  }

  public referenceOf(input: Referenceable<SchemaObject>): TypeNode {
    return getExternalTypeReferenceAst(input, this.context, this.config)
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return getTypeImports(fromPath, input, this.context, true)
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, 'json-schema/type')
    return success(
      createSourceFile(path, getTypeImports(path, schema, this.context, false), [
        getNamedTypeAst(schema, this.context, this.config),
      ]),
    )
  }
}
