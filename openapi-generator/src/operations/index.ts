import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import type { HttpMethod } from '@oats-ts/http'
import { OperationObject, ParameterObject, PathItemObject, ReferenceObject } from 'openapi3-ts'
import { Severity } from '@oats-ts/validators'
import { entries, isNil, negate } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import { generateOperationFunction } from './operation/generateOperationFunction'
import { generateOperationParameterType } from './parameterType/generateOperationParameterType'
import { generateOperationReturnType } from './returnType/generateOperationReturnType'
import { getEnhancedOperation } from './getEnhancedOperation'
import { generateOperationInputType } from './inputType/generateOperationInputType'
import { generateOperationParameterTypeSerializer } from './parameterSerializer/generateOperationParameterTypeSerializer'
import { generateResponseParserHint } from './responseParserHint/generateResponseParserHint'

function generateOperation(
  url: string,
  method: HttpMethod,
  operation: OperationObject,
  commonParameters: (ParameterObject | ReferenceObject)[],
  context: OpenAPIGeneratorContext,
): BabelModule[] {
  if (isNil(operation)) {
    return []
  }
  const enhancedOperation = getEnhancedOperation(url, method, operation, commonParameters, context)
  return [
    generateOperationParameterType('path', enhancedOperation, context),
    generateOperationParameterType('query', enhancedOperation, context),
    generateOperationParameterType('header', enhancedOperation, context),

    generateOperationReturnType(operation, context),
    generateOperationInputType(enhancedOperation, context),
    generateOperationParameterTypeSerializer(url, enhancedOperation.path, operation, context),
    generateOperationParameterTypeSerializer(url, enhancedOperation.query, operation, context),
    generateOperationParameterTypeSerializer(url, enhancedOperation.header, operation, context),
    generateResponseParserHint(enhancedOperation, context),
    generateOperationFunction(enhancedOperation, context),
  ].filter(negate(isNil))
}

function generatePathItemObjectAsts(
  url: string,
  data: PathItemObject,
  context: OpenAPIGeneratorContext,
): BabelModule[] {
  const { get, post, put, patch, trace, options, head, delete: _delete, parameters = [] } = data
  return [
    ...generateOperation(url, 'get', get, parameters, context),
    ...generateOperation(url, 'post', post, parameters, context),
    ...generateOperation(url, 'put', put, parameters, context),
    ...generateOperation(url, 'patch', patch, parameters, context),
    ...generateOperation(url, 'trace', trace, parameters, context),
    ...generateOperation(url, 'options', options, parameters, context),
    ...generateOperation(url, 'head', head, parameters, context),
    ...generateOperation(url, 'delete', _delete, parameters, context),
  ]
}

export const operations =
  (/* TODO config? */) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const { accessor } = context
    const modules: BabelModule[] = []
    const paths = entries<PathItemObject>(accessor.document().paths)
    for (const [url, pathItem] of paths) {
      modules.push(...generatePathItemObjectAsts(url, pathItem, context))
    }
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
