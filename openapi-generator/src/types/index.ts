import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Generator } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { sortBy } from 'lodash'
import { getNamedSchemas } from '../common/getNamedSchemas'
import { generateType } from './generateType'
import { TypesGeneratorConfig } from './typings'
import { createOpenAPIGeneratorContext } from '../defaults/createOpenAPIGeneratorContext'
import { OpenAPIGeneratorConfig, OpenAPIGeneratorTarget } from '../typings'

const consumes: OpenAPIGeneratorTarget[] = []
const produces: OpenAPIGeneratorTarget[] = ['type']

export const types = (
  config: OpenAPIGeneratorConfig & TypesGeneratorConfig,
): Generator<OpenAPIReadOutput, TypeScriptModule> => {
  return {
    id: 'openapi/types',
    consumes,
    produces,
    generate: async (data: OpenAPIReadOutput) => {
      const context = createOpenAPIGeneratorContext(data, config)
      const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
      const modules = schemas.map((schema): TypeScriptModule => generateType(schema, context, config))
      if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
        return { issues: context.issues }
      }
      return mergeTypeScriptModules(modules)
    },
  }
}
