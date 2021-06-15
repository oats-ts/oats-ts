import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { isNil, negate } from 'lodash'
import { OpenAPIGeneratorContext } from '../../typings'
import { getNamedSchemas } from '../getNamedSchemas'
import { generateTypeGuard } from './generateTypeGuards'
import { TypeGuardGeneratorConfig } from './typings'

export const typeGuards =
  (config: TypeGuardGeneratorConfig) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const schemas = getNamedSchemas(context)
    const modules = schemas
      .map((schema): BabelModule => generateTypeGuard(schema, context, config))
      .filter(negate(isNil))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
