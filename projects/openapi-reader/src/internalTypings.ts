import { OpenAPIObject } from '@oats-ts/openapi-model'
import { URIManipulatorType } from '@oats-ts/oats-ts'
import { Try } from '@oats-ts/try'
import { Referenceable } from '@oats-ts/json-schema-model'

export type ReferenceResolver = {
  resolveReferenceable<T>(
    input: ReadInput<Referenceable<T>>,
    context: ReadContext,
    resolveTarget: (input: ReadInput<T>, context: ReadContext) => Try<T>,
  ): Try<Referenceable<T>>
  resolveReferenceUri(input: ReadInput<string>, context: ReadContext): Try<string>
}

export type ReadContext = {
  readonly cache: ReadCache
  readonly externalDocumentUris: Set<string>
  readonly uri: URIManipulatorType
  readonly ref: ReferenceResolver
  resolve(uri: string): Promise<Try<OpenAPIObject>>
}

export type ReadCache = {
  readonly documents: Map<string, OpenAPIObject>
  readonly uriToObject: Map<string, any>
  readonly objectToUri: Map<any, string>
  readonly objectToName: Map<any, string>
  readonly objectToHash: Map<OpenAPIObject, number>
}

export type ReadInput<T> = {
  readonly data: T
  readonly uri: string
}
