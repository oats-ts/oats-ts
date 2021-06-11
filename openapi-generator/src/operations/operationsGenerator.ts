import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import type { HttpMethod } from '@oats-ts/http'
import { OperationObject, ParameterObject, PathItemObject, ReferenceObject } from 'openapi3-ts'
import { Severity } from '@oats-ts/validators'
import { entries, isNil, negate } from 'lodash'
import { OpenAPIGeneratorContext } from '../typings'
import { generateOperationFunction } from './generateOperationFunction'
import { generateParameterType } from './generateOperationParameterType'
import { generateOperationReturnType } from './generateOperationReturnType'
import { getPartitionedParameters } from './getPartitionedParameters'
import { generateOperationInputType } from './generateOperationInputType'
import { generateParameterTypeSerializer } from './generateParameterTypeSerializer'

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
  const parameters = getPartitionedParameters(operation, commonParameters, context)
  return [
    generateParameterType(parameters.path, operation, 'operation-path-type', context),
    generateParameterType(parameters.query, operation, 'operation-query-type', context),
    generateParameterType(parameters.header, operation, 'operation-headers-type', context),
    generateOperationReturnType(operation, context),
    generateOperationInputType(parameters, operation, context),
    generateParameterTypeSerializer(url, parameters.path, operation, context),
    generateParameterTypeSerializer(url, parameters.query, operation, context),
    generateParameterTypeSerializer(url, parameters.header, operation, context),
    generateOperationFunction(url, method, operation, context),
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

export const operationsGenerator =
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
