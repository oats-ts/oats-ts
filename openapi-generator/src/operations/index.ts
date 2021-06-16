import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '@oats-ts/validators'
import { flatMap, isNil, negate } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import { generateOperationFunction } from './operation/generateOperationFunction'
import { generateOperationParameterType } from './parameterType/generateOperationParameterType'
import { generateOperationReturnType } from './returnType/generateOperationReturnType'
import { getEnhancedOperations } from './getEnhancedOperations'
import { generateOperationInputType } from './inputType/generateOperationInputType'
import { generateOperationParameterTypeSerializer } from './parameterSerializer/generateOperationParameterTypeSerializer'
import { generateResponseParserHint } from './responseParserHint/generateResponseParserHint'
import { EnhancedOperation } from './typings'

export const operations =
  (/* TODO config? */) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const { accessor } = context
    const operations = getEnhancedOperations(accessor.document(), context)
    const operationModules: BabelModule[] = flatMap(operations, (operation: EnhancedOperation): BabelModule[] => {
      return [
        generateOperationParameterType('path', operation, context),
        generateOperationParameterType('query', operation, context),
        generateOperationParameterType('header', operation, context),
        generateOperationReturnType(operation.operation, context),
        generateOperationInputType(operation, context),
        generateOperationParameterTypeSerializer(operation.url, operation.path, operation.operation, context),
        generateOperationParameterTypeSerializer(operation.url, operation.query, operation.operation, context),
        generateOperationParameterTypeSerializer(operation.url, operation.header, operation.operation, context),
        generateResponseParserHint(operation, context),
        generateOperationFunction(operation, context),
      ].filter(negate(isNil))
    })

    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules: operationModules }
  }
