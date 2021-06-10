import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import type { HttpMethod } from '@oats-ts/http'
import { OperationObject, PathItemObject } from '@oats-ts/openapi-reader/node_modules/openapi3-ts'
import { Severity } from '@oats-ts/validators'
import { entries, isNil, negate } from 'lodash'
import { createImportDeclarations } from '../createImportDeclarations'
import { OpenAPIGeneratorContext } from '../typings'
import { generateOperationAst } from './generateOperationAst'

function generateOperation(
  url: string,
  method: HttpMethod,
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): BabelModule {
  if (!isNil(operation)) {
    return {
      imports: [],
      path: context.accessor.path(operation, 'operation'),
      statements: [generateOperationAst(url, method, operation, context)],
    }
  }
  return undefined
}

function generatePathItemObjectAsts(
  url: string,
  data: PathItemObject,
  context: OpenAPIGeneratorContext,
): BabelModule[] {
  const { get, post, put, patch, trace, options, head, delete: _delete } = data
  return [
    generateOperation(url, 'get', get, context),
    generateOperation(url, 'post', post, context),
    generateOperation(url, 'put', put, context),
    generateOperation(url, 'patch', patch, context),
    generateOperation(url, 'trace', trace, context),
    generateOperation(url, 'options', options, context),
    generateOperation(url, 'head', head, context),
    generateOperation(url, 'delete', _delete, context),
  ].filter(negate(isNil))
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
