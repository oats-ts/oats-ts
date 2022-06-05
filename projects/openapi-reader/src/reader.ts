import { isOk } from '@oats-ts/validators'
import { ContentReader } from '@oats-ts/oats'
import { resolveOpenAPIObject } from './resolveOpenAPIObject'
import { ReadContext } from './internalTypings'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadConfig, OpenAPIReadOutput } from './typings'
import { URIManipulator } from './utils/URIManipulator'
import { isFailure, success, Try } from '@oats-ts/try'
import { createResolver } from './utils/createResolver'
import { ReaderEventEmitter } from '../../oats/node_modules/@oats-ts/events'

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

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

export const reader =
  (config: OpenAPIReadConfig): ContentReader<OpenAPIObject, OpenAPIReadOutput> =>
  async (emitter: ReaderEventEmitter<OpenAPIObject, OpenAPIReadOutput>): Promise<Try<OpenAPIReadOutput>> => {
    emitter.emit('read-step-started', {
      type: 'read-step-started',
    })

    await tick()

    const { path, sanitize } = config
    const resolve = createResolver(config)

    const docUriTry = sanitize(path)
    if (isFailure(docUriTry)) {
      return docUriTry
    }

    const documentUri = docUriTry.data
    const context: ReadContext = {
      resolve,
      uri: new URIManipulator(),
      objectToName: new Map(),
      documents: new Map(),
      objectToUri: new Map(),
      uriToObject: new Map(),
      issues: [],
    }

    const documentTry = await resolve(documentUri)
    if (isFailure(documentTry)) {
      return { isOk: false, issues: documentTry.issues }
    }
    const document = documentTry.data
    context.documents.set(documentUri, document)

    await resolveOpenAPIObject({ data: document, uri: documentUri }, context)
    await resolveAll(new Set(documentUri), context)

    const { issues, documents, uriToObject, objectToName, objectToUri } = context

    const result = success({
      documentUri,
      document,
      documents,
      uriToObject,
      objectToUri,
      objectToName,
    })

    emitter.emit('read-step-completed', {
      type: 'read-step-completed',
      issues,
      data: result,
    })

    return result
  }
