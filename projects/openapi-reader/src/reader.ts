import { ContentReader } from '@oats-ts/oats'
import { ReadCache } from './internalTypings'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadConfig, OpenAPIReadOutput } from './typings'
import { fluent, Try } from '@oats-ts/try'
import { createResolver } from './utils/createResolver'
import { ReaderEventEmitter } from '@oats-ts/events'
import { resolveDocument } from './resolveDocument'
import { tick } from './utils/tick'

export const reader =
  (config: OpenAPIReadConfig): ContentReader<OpenAPIObject, OpenAPIReadOutput> =>
  async (emitter: ReaderEventEmitter<OpenAPIObject, OpenAPIReadOutput>): Promise<Try<OpenAPIReadOutput>> => {
    emitter.emit('read-step-started', {
      type: 'read-step-started',
    })

    await tick()

    const { path, sanitize } = config
    const resolve = createResolver(config)

    const cache: ReadCache = {
      documents: new Map(),
      objectToName: new Map(),
      objectToUri: new Map(),
      uriToObject: new Map(),
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
      data: result,
    })

    await tick()

    return result
  }
