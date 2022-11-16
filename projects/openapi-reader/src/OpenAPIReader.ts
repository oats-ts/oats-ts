import { tick } from '@oats-ts/model-common'
import { ContentReader, ReaderEventEmitter, URIManipulator } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { fluent, isFailure, isSuccess, success, Try } from '@oats-ts/try'
import {
  OpenAPIDocumentTraverser,
  OpenAPIReadConfig,
  OpenAPIReadOutput,
  ReadCache,
  ReadContext,
  ReferenceTraverser,
} from './typings'

import { OpenAPIDocumentTraverserImpl } from './OpenAPIDocumentTraverserImpl'
import { FirstPassReferenceTraverserImpl } from './FirstPassReferenceTraverserImpl'
import { SecondPassReferenceTraverserImpl } from './SecondPassReferenceTraverserImpl'

export class OpenAPIReader implements ContentReader<OpenAPIObject, OpenAPIReadOutput> {
  private _cache: ReadCache
  protected emitter: ReaderEventEmitter<OpenAPIObject, OpenAPIReadOutput> | undefined

  constructor(private _config: OpenAPIReadConfig) {
    this._cache = this.createReadCache()
  }

  protected name(): string {
    return '@oats-ts/openapi-reader'
  }

  protected config(): OpenAPIReadConfig {
    return this._config
  }

  protected cache(): ReadCache {
    return this._cache
  }

  protected createReadCache(): ReadCache {
    return {
      documents: new Map(),
      objectToName: new Map(),
      objectToUri: new Map(),
      uriToObject: new Map(),
      objectToHash: new Map(),
    }
  }

  protected createOpenAPIDocumentTraverser(
    context: ReadContext,
    refTraverser: ReferenceTraverser,
  ): OpenAPIDocumentTraverser {
    return new OpenAPIDocumentTraverserImpl(context, refTraverser)
  }

  protected createFirstPassRefenceTraverser(context: ReadContext): ReferenceTraverser {
    return new FirstPassReferenceTraverserImpl(context)
  }

  protected createSecondPassReferenceTraverser(context: ReadContext): ReferenceTraverser {
    return new SecondPassReferenceTraverserImpl(context)
  }

  protected async readAndParseUriContent(uri: string): Promise<Try<OpenAPIObject>> {
    const { read, parse } = this.config()
    const content = await read(uri)
    if (!isSuccess(content)) {
      return content
    }
    return parse(uri, content.data)
  }

  protected async readSingleDocument(path: string, sanitize: boolean): Promise<Try<[OpenAPIObject, string]>> {
    // Emit that we started work on the document
    this.emitter?.emit('read-file-started', {
      type: 'read-file-started',
      path,
    })

    await tick()

    // Sanitize URI, this is important for user-input
    const sanitizedUri = sanitize ? await this.config().sanitize(path) : success(path)

    // Stop the process if sanitization failed
    if (isFailure(sanitizedUri)) {
      this.emitter?.emit('read-file-completed', {
        type: 'read-file-completed',
        data: sanitizedUri,
        issues: [],
        path,
      })
      await tick()
      return sanitizedUri
    }

    const readContext: ReadContext = {
      cache: this.cache(),
      uri: new URIManipulator(),
      externalDocumentUris: new Set(),
    }

    // Read the document from the disk or from remote
    const rawDocument = await this.readAndParseUriContent(sanitizedUri.data)

    // Register the document in the cache so others have access to it
    if (isSuccess(rawDocument)) {
      this.cache().documents.set(sanitizedUri.data, rawDocument.data)
      this.cache().objectToUri.set(rawDocument.data, sanitizedUri.data)
    }

    // Explore the document, resolve/validate what's inside the document already, collect unresolved external refs
    let readResult = fluent(rawDocument).flatMap((data) =>
      this.createOpenAPIDocumentTraverser(readContext, this.createFirstPassRefenceTraverser(readContext)).traverse(
        data,
      ),
    )

    // If we have external references
    if (readContext.externalDocumentUris.size > 0) {
      // Resolve each external document
      await Promise.allSettled(
        Array.from(readContext.externalDocumentUris).map((refUri) => this.readSingleDocument(refUri, false)),
      )

      // Build a read-context, that will try to resolve both internal and external references
      const resolveContext: ReadContext = {
        ...readContext,
        externalDocumentUris: new Set(),
      }

      // Do a second pass on the document and resolve external references as well
      readResult = fluent(readResult).flatMap((data) =>
        this.createOpenAPIDocumentTraverser(
          resolveContext,
          this.createSecondPassReferenceTraverser(resolveContext),
        ).traverse(data),
      )
    }

    // Emit that we are finished with the file
    this.emitter?.emit('read-file-completed', {
      type: 'read-file-completed',
      data: readResult.toTry(),
      issues: [],
      path: sanitizedUri.data,
    })

    await tick()

    // Return the partial result
    return fluent(readResult)
      .map((data): [OpenAPIObject, string] => [data, sanitizedUri.data])
      .toTry()
  }

  public async read(emitter: ReaderEventEmitter<OpenAPIObject, OpenAPIReadOutput>): Promise<Try<OpenAPIReadOutput>> {
    this.emitter = emitter
    this.emitter?.emit('read-step-started', {
      type: 'read-step-started',
      name: this.name(),
    })

    await tick()

    const { path } = this.config()

    const mainDocResult = await this.readSingleDocument(path, true)

    const result = fluent(mainDocResult).map(
      ([document, documentUri]): OpenAPIReadOutput => ({
        documentUri,
        document,
        ...this.cache(),
      }),
    )

    this.emitter?.emit('read-step-completed', {
      type: 'read-step-completed',
      issues: [],
      name: this.name(),
      data: result,
    })

    await tick()

    return result
  }
}
