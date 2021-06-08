import { OpenAPIGeneratorOutput } from '../../types/OpenAPIGeneratorOutput'
import { TypeScriptUnit } from '../../types/TypeScriptUnit'
import { GeneratorContext } from '../typings'
import { collectNamedSchemas } from './collectNamedTypes'
import { generateTypeAst } from './generateTypeAst'
import { SchemaContext, SchemaTypesGeneratorConfig } from './types'

export const schemaTypesGenerator =
  (config: SchemaTypesGeneratorConfig) =>
  async (input: GeneratorContext): Promise<OpenAPIGeneratorOutput> => {
    const context: SchemaContext = { ...input, ...config }

    const schemas = collectNamedSchemas(context)
    const units = schemas.map((schema): TypeScriptUnit => {
      const statement = generateTypeAst({ data: schema, uri: 'TODO' }, context)
      const path = context.path(context.utils.nameOf(schema), schema)
      const imports = []
      return {
        content: [statement],
        path,
        imports,
      }
    })

    return { issues: context.issues, units }
  }
