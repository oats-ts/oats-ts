import { Severity } from '@oats-ts/validators'
import type { Try } from '@oats-ts/generator'
import { resolveOpenAPIObject } from './resolveOpenAPIObject'
import { ReadContext } from './internalTypings'
import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIReadConfig, OpenAPIReadOutput } from './typings'
import { defaultOpenAPIReadConfig } from './defaults/defaultOpenAPIReadConfig'

function getUnresolved(resolved: Set<string>, documents: Map<string, OpenAPIObject>): Map<string, OpenAPIObject> {
  const unresolved: Map<string, OpenAPIObject> = new Map()
  for (const [uri, schema] of Array.from(documents.entries())) {
    if (!resolved.has(uri)) {
      unresolved.set(uri, schema)
    }
  }
  return unresolved
}

async function resolveAll(resolved: Set<string>, context: ReadContext) {
  const hasIssues = context.issues.some((issue) => issue.severity === 'error')

  if (hasIssues) {
    return
  }

  const unresolved = getUnresolved(resolved, context.documents)

  if (unresolved.size === 0) {
    return
  }

  for (const [uri, data] of Array.from(unresolved.entries())) {
    await resolveOpenAPIObject({ data, uri }, context)
    resolved.add(uri)
  }

  await resolveAll(resolved, context)
}

export const openAPIReader = (config: OpenAPIReadConfig) => async (): Promise<Try<OpenAPIReadOutput>> => {
  const { path, resolve, uriManipulator } = defaultOpenAPIReadConfig(config)

  const documentUri = uriManipulator.sanitize(path)

  const context: ReadContext = {
    resolve,
    uri: uriManipulator,
    issues: [],
    objectToName: new Map(),
    documents: new Map(),
    objectToUri: new Map(),
    uriToObject: new Map(),
  }

  const rootSpec = await resolve(documentUri)
  context.documents.set(documentUri, rootSpec)

  await resolveOpenAPIObject({ data: rootSpec, uri: documentUri }, context)
  await resolveAll(new Set(documentUri), context)

  const hasIssues = context.issues.some((issue) => issue.severity === 'error')

  if (hasIssues) {
    return { issues: context.issues }
  }

  return {
    documentUri,
    document: rootSpec,
    documents: context.documents,
    uriToObject: context.uriToObject,
    objectToUri: context.objectToUri,
    objectToName: context.objectToName,
  }
}
