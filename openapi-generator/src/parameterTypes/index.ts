import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { CodeGenerator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import {
  generateHeaderParametersType,
  generatePathParametersType,
  generateQueryParametersType,
} from '../parameterTypes/generateOperationParameterType'
import { getEnhancedOperations } from '../common/getEnhancedOperations'
import { EnhancedOperation } from '../operations/typings'
import { ParameterTypesGeneratorConfig } from './typings'
import { createOpenAPIGeneratorContext } from '../defaults/createOpenAPIGeneratorContext'
import { OpenAPIGenerator, OpenAPIGeneratorConfig, OpenAPIGeneratorTarget } from '../typings'

const consumes: OpenAPIGeneratorTarget[] = ['type']
const produces: OpenAPIGeneratorTarget[] = ['operation-headers-type', 'operation-path-type', 'operation-query-type']

export const parameterTypes = (config: OpenAPIGeneratorConfig & ParameterTypesGeneratorConfig): OpenAPIGenerator => {
  return {
    id: 'openapi/parameterTypes',
    consumes,
    produces,
    generate: async (data: OpenAPIReadOutput, generators: OpenAPIGenerator[]) => {
      const context = createOpenAPIGeneratorContext(data, config, generators)
      const { accessor } = context
      const operations = sortBy(getEnhancedOperations(accessor.document(), context), ({ operation }) =>
        accessor.name(operation, 'operation'),
      )
      const modules: TypeScriptModule[] = flatMap(operations, (operation: EnhancedOperation): TypeScriptModule[] => {
        return [
          generatePathParametersType(operation, context, config),
          generateQueryParametersType(operation, context, config),
          generateHeaderParametersType(operation, context, config),
        ].filter(negate(isNil))
      })

      if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
        return { issues: context.issues }
      }
      return mergeTypeScriptModules(modules)
    },
  }
}
