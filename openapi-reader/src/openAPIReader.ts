import { defaultOpenAPIGlobalConfig } from '../../defaults/defaultOpenAPIGlobalConfig'
import { defaultOpenAPIReadConfig } from '../defaults/defaultOpenAPIReadConfig'
import { Severity } from '../../validation/typings'
import { OpenAPIGlobalConfig } from '../types/OpenAPIGlobalConfig'
import { OpenAPIReadConfig } from '../types/OpenAPIReadConfig'
import { OpenAPIReadOutput } from '../types/OpenAPIReadOutput'
import { resolveOpenAPIObject } from './resolveOpenAPIObject'
import { ReadContext } from './types'
import { OpenAPIObject } from 'openapi3-ts'

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
  const hasIssues = context.issues.some((issue) => issue.severity === Severity.ERROR)

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

export const openAPIReader =
  (readConfig: Partial<OpenAPIReadConfig> = {}) =>
  (globalConfig: Partial<OpenAPIGlobalConfig> = {}) =>
  async (): Promise<OpenAPIReadOutput> => {
    const { path, resolve } = defaultOpenAPIReadConfig(readConfig)
    const { uri } = defaultOpenAPIGlobalConfig(globalConfig)

    const documentUri = uri.sanitize(path)

    const context: ReadContext = {
      resolve,
      uri,
      issues: [],
      documents: new Map(),
      byComponent: new Map(),
      byUri: new Map(),
    }

    const rootSpec = await resolve(documentUri)
    context.documents.set(documentUri, rootSpec)

    await resolveOpenAPIObject({ data: rootSpec, uri: documentUri }, context)
    await resolveAll(new Set(documentUri), context)

    const hasIssues = context.issues.some((issue) => issue.severity === Severity.ERROR)

    return {
      documentUri,
      document: hasIssues ? null : rootSpec,
      documents: hasIssues ? null : context.documents,
      uris: hasIssues ? null : context.byComponent,
      issues: context.issues,
    }
  }
