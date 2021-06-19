import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { sortBy } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedSchemas } from '../common/getNamedSchemas'
import { generateValidator } from './generateValidator'

export const validators =
  (/* TODO config? */) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
    const modules = schemas.map((schema): BabelModule => generateValidator(schema, context))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
