import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedSchemas } from './getNamedSchemas'
import { generateType } from './types/generateType'

export const types =
  (/* TODO config? */) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const schemas = getNamedSchemas(context)
    const modules = schemas.map((schema): BabelModule => generateType(schema, context))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
