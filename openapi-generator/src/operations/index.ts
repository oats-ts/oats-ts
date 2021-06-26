import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { CodeGenerator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { generateOperationFunction } from './operation/generateOperationFunction'
import { generateOperationReturnType } from './returnType/generateOperationReturnType'
import { getEnhancedOperations } from '../common/getEnhancedOperations'
import { generateOperationInputType } from './inputType/generateOperationInputType'
import {
  generateHeaderParameterTypeSerializer,
  generatePathParameterTypeSerializer,
  generateQueryParameterTypeSerializer,
} from './parameterSerializer/generateOperationParameterTypeSerializer'
import { generateResponseParserHint } from './responseParserHint/generateResponseParserHint'
import { EnhancedOperation, OperationsGeneratorConfig } from './typings'
import { createOpenAPIGeneratorContext } from '../defaults/createOpenAPIGeneratorContext'
import { OpenAPIGenerator, OpenAPIGeneratorConfig, OpenAPIGeneratorTarget } from '../typings'

const consumes: OpenAPIGeneratorTarget[] = [
  'type',
  'operation-headers-type',
  'operation-query-type',
  'operation-path-type',
]
const produces: OpenAPIGeneratorTarget[] = [
  'operation',
  'operation-response-type',
  'operation-input-type',
  'operation-headers-serializer',
  'operation-path-serializer',
  'operation-query-serializer',
  'operation-response-parser-hint',
]

export const operations = (config: OpenAPIGeneratorConfig & OperationsGeneratorConfig): OpenAPIGenerator => {
  return {
    id: 'openapi/operations',
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
          generateOperationReturnType(operation, context),
          generateOperationInputType(operation, context),
          generatePathParameterTypeSerializer(operation, context),
          generateQueryParameterTypeSerializer(operation, context),
          generateHeaderParameterTypeSerializer(operation, context),
          generateResponseParserHint(operation, context),
          generateOperationFunction(operation, context, config),
        ].filter(negate(isNil))
      })

      if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
        return { issues: context.issues }
      }
      return mergeTypeScriptModules(modules)
    },
  }
}
