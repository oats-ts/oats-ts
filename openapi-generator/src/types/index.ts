import { TypeScriptModule, TypeScriptGeneratorOutput } from '@oats-ts/typescript-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { sortBy } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedSchemas } from '../common/getNamedSchemas'
import { generateType } from './generateType'
import { TypesGeneratorConfig } from './typings'

export const types =
  (config: TypesGeneratorConfig) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<TypeScriptGeneratorOutput>> => {
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
    const modules = schemas.map((schema): TypeScriptModule => generateType(schema, context, config))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
