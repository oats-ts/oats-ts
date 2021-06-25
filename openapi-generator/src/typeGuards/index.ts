import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { Generator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { isNil, negate, sortBy } from 'lodash'
import { getNamedSchemas } from '../common/getNamedSchemas'
import { generateTypeGuard } from './generateTypeGuards'
import { TypeGuardGeneratorConfig } from './typings'
import { createOpenAPIGeneratorContext } from '../defaults/createOpenAPIGeneratorContext'
import { OpenAPIGeneratorConfig, OpenAPIGeneratorTarget } from '../typings'

const consumes: OpenAPIGeneratorTarget[] = ['type']
const produces: OpenAPIGeneratorTarget[] = ['type-guard']

export const typeGuards = (
  config: OpenAPIGeneratorConfig & TypeGuardGeneratorConfig,
): Generator<OpenAPIReadOutput, TypeScriptModule> => {
  return {
    id: 'openapi/typeGuards',
    consumes,
    produces,
    generate: async (data: OpenAPIReadOutput) => {
      const context = createOpenAPIGeneratorContext(data, config)
      const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
      const modules = schemas
        .map((schema): TypeScriptModule => generateTypeGuard(schema, context, config))
        .filter(negate(isNil))
      if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
        return { issues: context.issues }
      }
      return mergeTypeScriptModules(modules)
    },
  }
}
