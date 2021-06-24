import { TypeScriptGeneratorOutput, TypeScriptModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import {
  generateHeaderParametersType,
  generatePathParametersType,
  generateQueryParametersType,
} from '../parameterTypes/generateOperationParameterType'
import { getEnhancedOperations } from '../common/getEnhancedOperations'
import { EnhancedOperation } from '../operations/typings'
import { ParameterTypesGeneratorConfig } from './typings'

export const parameterTypes =
  (config: ParameterTypesGeneratorConfig) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<TypeScriptGeneratorOutput>> => {
    const { accessor } = context
    const operations = sortBy(getEnhancedOperations(accessor.document(), context), ({ operation }) =>
      accessor.name(operation, 'operation'),
    )
    const parameterModules: TypeScriptModule[] = flatMap(
      operations,
      (operation: EnhancedOperation): TypeScriptModule[] => {
        return [
          generatePathParametersType(operation, context, config),
          generateQueryParametersType(operation, context, config),
          generateHeaderParametersType(operation, context, config),
        ].filter(negate(isNil))
      },
    )

    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules: parameterModules }
  }
