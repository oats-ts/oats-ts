import { Referenceable } from '@oats-ts/json-schema-model'
import { ContentReader, URIManipulatorType } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { Try } from '@oats-ts/try'

/**
 * @param path The input path
 * @returns A sanitized, fully qualified URI
 */
export type SanitizeFn = (path: string) => Promise<Try<string>>
/**
 * @param uri The full URI of the document.
 * @returns The contents of the document at the URI as string.
 */
export type ReadFn = (uri: string) => Promise<Try<string>>
/**
 * @param uri The full URI of the document parsed.
 * @param input The string contents of an OpenAPI document
 * @returns The parsed openapi document
 */
export type ParseFn = (uri: string, input: string) => Promise<Try<OpenAPIObject>>

/** In memory URI => string content mapping */
export type MemoryReadContent = { [uri: string]: string }

/** Configuration object for reading OpenAPI documents. */
export type OpenAPIReadConfig = {
  /** The path of the documents. Either a full URI or local file path. */
  path: string
  /** Sanitizes the given URI or path, and turns it into a fully qualified URI */
  sanitize: SanitizeFn
  /** Reads the content of a fully qualified URI, and returns it as string */
  read: ReadFn
  /** Parses the given string content into an in memory object tree. */
  parse: ParseFn
}

export type OpenAPIDocumentTraverser = {
  traverse: (document: OpenAPIObject) => Try<OpenAPIObject>
}

export type TargetTraverser<T> = (data: T, uri: string) => Try<T>

export type ReferenceTraverser = {
  traverseReferenceable<T>(data: Referenceable<T>, uri: string, target: TargetTraverser<T>): Try<Referenceable<T>>
  traverseReference(uri: string, fromUri: string): Try<string>
}

export type SchemeConfig = {
  http: boolean
  https: boolean
  file: boolean
}

export type ReaderFactory = (path: string) => ContentReader<OpenAPIObject, OpenAPIReadOutput>
export type MemoryReaderFactory = (
  path: string,
  content: MemoryReadContent,
) => ContentReader<OpenAPIObject, OpenAPIReadOutput>

export type ReaderFactoriesByFormat<T> = {
  json: T
  yaml: T
  mixed: T
}

export type MemoryReaders = {
  http: ReaderFactoriesByFormat<MemoryReaderFactory>
  https: ReaderFactoriesByFormat<MemoryReaderFactory>
  file: ReaderFactoriesByFormat<MemoryReaderFactory>
  mixed: ReaderFactoriesByFormat<MemoryReaderFactory>
}

export type DefaultReaders = {
  http: ReaderFactoriesByFormat<ReaderFactory>
  https: ReaderFactoriesByFormat<ReaderFactory>
  file: ReaderFactoriesByFormat<ReaderFactory>
  mixed: ReaderFactoriesByFormat<ReaderFactory>
}

export type Readers = DefaultReaders & {
  custom: (config: OpenAPIReadConfig) => ContentReader<OpenAPIObject, OpenAPIReadOutput>
  memory: MemoryReaders
}

export type ReadContext = {
  readonly cache: ReadCache
  readonly externalDocumentUris: Set<string>
  readonly uri: URIManipulatorType
}

export type ReadCache = {
  readonly documents: Map<string, OpenAPIObject>
  readonly uriToObject: Map<string, any>
  readonly objectToUri: Map<any, string>
  readonly objectToName: Map<any, string>
  readonly objectToHash: Map<any, number>
}
