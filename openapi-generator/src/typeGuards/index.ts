import { TypeScriptGeneratorOutput, TypeScriptModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { isNil, negate, sortBy } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedSchemas } from '../common/getNamedSchemas'
import { generateTypeGuard } from './generateTypeGuards'
import { TypeGuardGeneratorConfig } from './typings'

export const typeGuards =
  (config: TypeGuardGeneratorConfig) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<TypeScriptGeneratorOutput>> => {
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
    const modules = schemas
      .map((schema): TypeScriptModule => generateTypeGuard(schema, context, config))
      .filter(negate(isNil))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
