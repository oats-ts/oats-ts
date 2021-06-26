import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { sortBy } from 'lodash'
import { getNamedSchemas } from '../common/getNamedSchemas'
import { generateType } from './generateType'
import { TypesGeneratorConfig } from './typings'
import { createOpenAPIGeneratorContext } from '../defaults/createOpenAPIGeneratorContext'
import { OpenAPIGenerator, OpenAPIGeneratorConfig, OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../typings'
import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { Node } from 'typescript'
import { getTypeReferenceAst } from './getTypeReferenceAst'

const consumes: OpenAPIGeneratorTarget[] = []
const produces: OpenAPIGeneratorTarget[] = ['type']

export const types = (config: OpenAPIGeneratorConfig & TypesGeneratorConfig): OpenAPIGenerator => {
  let context: OpenAPIGeneratorContext = null
  return {
    id: 'openapi/types',
    consumes,
    produces,
    initialize: (data: OpenAPIReadOutput, generators: OpenAPIGenerator[]) => {
      context = createOpenAPIGeneratorContext(data, config, generators)
    },
    generate: async () => {
      const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
      const modules = schemas.map((schema): TypeScriptModule => generateType(schema, context, config))
      if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
        return { issues: context.issues }
      }
      return mergeTypeScriptModules(modules)
    },
    reference: (input: SchemaObject | ReferenceObject, target: OpenAPIGeneratorTarget): Node => {
      switch (target) {
        case 'type':
          return getTypeReferenceAst(input, context, config)
        default:
          return undefined
      }
    },
  }
}
