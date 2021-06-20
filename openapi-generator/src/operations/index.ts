import { TypeScriptGeneratorOutput, TypeScriptModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import { generateOperationFunction } from './operation/generateOperationFunction'
import {
  generateHeaderParametersType,
  generatePathParametersType,
  generateQueryParametersType,
} from './parameterType/generateOperationParameterType'
import { generateOperationReturnType } from './returnType/generateOperationReturnType'
import { getEnhancedOperations } from './getEnhancedOperations'
import { generateOperationInputType } from './inputType/generateOperationInputType'
import {
  generateHeaderParameterTypeSerializer,
  generatePathParameterTypeSerializer,
  generateQueryParameterTypeSerializer,
} from './parameterSerializer/generateOperationParameterTypeSerializer'
import { generateResponseParserHint } from './responseParserHint/generateResponseParserHint'
import { EnhancedOperation } from './typings'

export const operations =
  (/* TODO config? */) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<TypeScriptGeneratorOutput>> => {
    const { accessor } = context
    const operations = sortBy(getEnhancedOperations(accessor.document(), context), ({ operation }) =>
      accessor.name(operation, 'operation'),
    )
    const operationModules: TypeScriptModule[] = flatMap(
      operations,
      (operation: EnhancedOperation): TypeScriptModule[] => {
        return [
          generatePathParametersType(operation, context),
          generateQueryParametersType(operation, context),
          generateHeaderParametersType(operation, context),
          generateOperationReturnType(operation, context),
          generateOperationInputType(operation, context),
          generatePathParameterTypeSerializer(operation, context),
          generateQueryParameterTypeSerializer(operation, context),
          generateHeaderParameterTypeSerializer(operation, context),
          generateResponseParserHint(operation, context),
          generateOperationFunction(operation, context),
        ].filter(negate(isNil))
      },
    )

    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules: operationModules }
  }
