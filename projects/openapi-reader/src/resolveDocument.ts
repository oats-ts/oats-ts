import { ReadCache, ReadContext, ReadInput } from './internalTypings'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from './typings'
import { URIManipulator } from '@oats-ts/oats-ts'
import { fluent, isFailure, isSuccess, success, Try } from '@oats-ts/try'
import { ReaderEventEmitter } from '@oats-ts/oats-ts'
import { ReadRefResolver } from './ReadRefResolver'
import { OpenAPIResolverImpl } from './OpenAPIResolverImpl'
import { tick } from '@oats-ts/model-common'
import { VerifyRefResolver } from './VerifyRefResolver'

async function defaultSanitizer(uri: string): Promise<Try<string>> {
  return success(uri)
}

export async function resolveDocument(
  path: string,
  cache: ReadCache,
  emitter: ReaderEventEmitter<OpenAPIObject, OpenAPIReadOutput>,
  resolve: (uri: string) => Promise<Try<OpenAPIObject>>,
  sanitize: (uri: string) => Promise<Try<string>> = defaultSanitizer,
): Promise<Try<ReadInput<OpenAPIObject>>> {
  // Emit that we started work on the document
  emitter.emit('read-file-started', {
    type: 'read-file-started',
    path,
  })

  await tick()

  // Sanitize URI, this is important for user-input
  const sanitizedUri = await sanitize(path)

  // Stop the process if sanitization failed
  if (isFailure(sanitizedUri)) {
    emitter.emit('read-file-completed', {
      type: 'read-file-completed',
      data: sanitizedUri,
      issues: [],
      path,
    })
    await tick()
    return sanitizedUri
  }

  const readContext: ReadContext = {
    resolve,
    cache,
    uri: new URIManipulator(),
    ref: undefined!,
    externalDocumentUris: new Set(),
  }

  // Read the document from the disk or from remote
  const rawDocument = await resolve(sanitizedUri.data)

  // Register the document in the cache so others have access to it
  if (isSuccess(rawDocument)) {
    cache.documents.set(sanitizedUri.data, rawDocument.data)
    cache.objectToUri.set(rawDocument.data, sanitizedUri.data)
  }

  // Explore the document, resolve/validate what's inside the document already, collect unresolved external refs
  let readResult = fluent(rawDocument).flatMap((data) =>
    new OpenAPIResolverImpl(readContext, new ReadRefResolver(readContext)).resolve(data),
  )

  // If we have external references
  if (readContext.externalDocumentUris.size > 0) {
    // Resolve each external document
    await Promise.allSettled(
      Array.from(readContext.externalDocumentUris).map((refUri) => resolveDocument(refUri, cache, emitter, resolve)),
    )

    // Build a read-context, that will try to resolve both internal and external references
    const resolveContext: ReadContext = {
      ...readContext,
      externalDocumentUris: new Set(),
      ref: undefined!,
    }

    // Do a second pass on the document and resolve external references as well
    readResult = fluent(readResult).flatMap((data) =>
      new OpenAPIResolverImpl(resolveContext, new VerifyRefResolver(readContext)).resolve(data),
    )
  }

  // Emit that we are finished with the file
  emitter.emit('read-file-completed', {
    type: 'read-file-completed',
    data: readResult.toTry(),
    issues: [],
    path: sanitizedUri.data,
  })

  await tick()

  // Return the partial result
  return fluent(readResult)
    .map((data) => ({ data, uri: sanitizedUri.data }))
    .toTry()
}
