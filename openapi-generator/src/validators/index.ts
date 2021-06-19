import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { sortBy } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedSchemas } from '../common/getNamedSchemas'
import { generateValidator } from './generateValidator'
import { ValidatorsGeneratorConfig } from './typings'

export const validators =
  (config: ValidatorsGeneratorConfig) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
    const modules = schemas.map((schema): BabelModule => generateValidator(schema, context, config.references))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
