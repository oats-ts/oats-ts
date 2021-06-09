import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '../typings'
import { collectNamedSchemas } from './collectNamedTypes'
import { generateTypeAst } from './generateTypeAst'

export const schemaTypesGenerator =
  (/* TODO config? */) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const schemas = collectNamedSchemas(context)
    const modules = schemas.map((schema): BabelModule => {
      const statement = generateTypeAst(schema, context)
      const path = context.accessor.path(schema, 'schema')
      return {
        statements: [statement],
        path,
        imports: [],
      }
    })
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
