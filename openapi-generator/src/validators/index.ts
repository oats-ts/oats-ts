import { Generator } from '@oats-ts/generator'
import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { sortBy } from 'lodash'
import { getNamedSchemas } from '../common/getNamedSchemas'
import { createOpenAPIGeneratorContext } from '../defaults/createOpenAPIGeneratorContext'
import { generateValidator } from './generateValidator'
import { ValidatorsGeneratorConfig } from './typings'
import { OpenAPIGeneratorConfig, OpenAPIGeneratorTarget } from '../typings'

const consumes: OpenAPIGeneratorTarget[] = ['type']
const produces: OpenAPIGeneratorTarget[] = ['validator']

export const validators = (
  config: OpenAPIGeneratorConfig & ValidatorsGeneratorConfig,
): Generator<OpenAPIReadOutput, TypeScriptModule> => {
  return {
    id: 'openapi/validators',
    consumes,
    produces,
    generate: async (data: OpenAPIReadOutput) => {
      const context = createOpenAPIGeneratorContext(data, config)
      const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
      const modules = schemas.map((schema): TypeScriptModule => generateValidator(schema, context, config))
      if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
        return { issues: context.issues }
      }
      return mergeTypeScriptModules(modules)
    },
  }
}
