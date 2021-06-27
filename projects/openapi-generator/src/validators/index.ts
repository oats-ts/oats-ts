import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { sortBy } from 'lodash'
import {
  getNamedSchemas,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  OpenAPIGeneratorConfig,
} from '@oats-ts/openapi-common'
import { createOpenAPIGeneratorContext } from '../defaults/createOpenAPIGeneratorContext'
import { generateValidator } from './generateValidator'
import { ValidatorsGeneratorConfig } from './typings'

const consumes: OpenAPIGeneratorTarget[] = ['type']
const produces: OpenAPIGeneratorTarget[] = ['validator']

export const validators = (config: OpenAPIGeneratorConfig & ValidatorsGeneratorConfig): OpenAPIGenerator => {
  let context: OpenAPIGeneratorContext = null
  return {
    id: 'openapi/validators',
    consumes,
    produces,
    initialize: (data: OpenAPIReadOutput, generators: OpenAPIGenerator[]) => {
      context = createOpenAPIGeneratorContext(data, config, generators)
    },
    generate: async () => {
      const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
      const modules = schemas.map((schema): TypeScriptModule => generateValidator(schema, context, config))
      if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
        return { issues: context.issues }
      }
      return mergeTypeScriptModules(modules)
    },
  }
}
