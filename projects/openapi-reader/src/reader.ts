import { ContentReader, ReaderEventEmitter } from '@oats-ts/oats-ts'
import { ReadCache } from './internalTypings'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadConfig, OpenAPIReadOutput } from './typings'
import { fluent, Try } from '@oats-ts/try'
import { createResolver } from './utils/createResolver'
import { resolveDocument } from './resolveDocument'
import { tick } from '@oats-ts/model-common'

const name = '@oats-ts/openapi-reader'

export const reader =
  (config: OpenAPIReadConfig): ContentReader<OpenAPIObject, OpenAPIReadOutput> =>
  async (emitter: ReaderEventEmitter<OpenAPIObject, OpenAPIReadOutput>): Promise<Try<OpenAPIReadOutput>> => {
    emitter.emit('read-step-started', {
      type: 'read-step-started',
      name,
    })

    await tick()

    const { path, sanitize } = config
    const resolve = createResolver(config)

    const cache: ReadCache = {
      documents: new Map(),
      objectToName: new Map(),
      objectToUri: new Map(),
      uriToObject: new Map(),
      objectToHash: new Map(),
    }

    const mainDocResult = await resolveDocument(path, cache, emitter, resolve, sanitize)

    const result = fluent(mainDocResult).map(
      ({ data: document, uri: documentUri }): OpenAPIReadOutput => ({
        documentUri,
        document,
        ...cache,
      }),
    )

    emitter.emit('read-step-completed', {
      type: 'read-step-completed',
      issues: [],
      name,
      data: result,
    })

    await tick()

    return result
  }
