import { ContentReader } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { Try } from '@oats-ts/try'

/** Configuration object for reading OpenAPI documents. */
export type OpenAPIReadConfig = {
  /** The path of the documents. Either a full URI or local file path. */
  path: string
  /**
   * @param path The input path
   * @returns A sanitized, fully qualified URI
   */
  sanitize(path: string): Promise<Try<string>>
  /**
   * @param uri The full URI of the document.
   * @returns The contents of the document at the URI as string.
   */
  read(uri: string): Promise<Try<string>>
  /**
   * @param uri The full URI of the document parsed.
   * @param input The string contents of an OpenAPI document
   * @returns The parsed openapi document
   */
  parse(uri: string, input: string): Promise<Try<OpenAPIObject>>
}

/** Globaly used utility to work with URIs found in OpenAPI refs and discriminators. */
export type URIManipulatorType = {
  /**
   * @param path A URI fragment.
   * @param segments Possibly other URI fragment pieces.
   * @returns A URI fragment composed from the pieces
   */
  append(path: string, ...segments: (string | number)[]): string
  /**
   * @param ref A partial or full URI (possibly just a fragment).
   * @param parent A full URI.
   * @returns A resolved full URI.
   */
  resolve(ref: string, parent: string): string
  /**
   * @param path A full URI.
   * @returns The URI without any fragments.
   */
  document(path: string): string
  /**
   * @param uri A full or partial URI.
   * @returns It's fragments split by "/"
   */
  fragments(uri: string): string[]
}

export type OpenAPIReadOutput = {
  /** The full URI of the root document */
  documentUri: string
  /** The root OpenAPI document */
  document: OpenAPIObject
  /** An URI -> OpenAPI document map. Contains all referenced documents fully resolved. */
  documents: Map<string, OpenAPIObject>
  /** An object -> URI mapping for all the objects the resolution traversed */
  objectToUri: Map<any, string>
  /** An URI -> object mapping for all the objects the resolution traversed */
  uriToObject: Map<string, any>
  /** An object -> name mapping for entites that don't encapsulate their names, eg.: schemas. */
  objectToName: Map<any, string>
}

export type SchemeConfig = {
  http: boolean
  https: boolean
  file: boolean
}

export type TestReaderConfig = {
  path: string
  content: Map<string, string>
  httpRefs?: boolean
  httpsRefs?: boolean
  fileRefs?: boolean
}

export type ReaderFactory = (path: string) => ContentReader<OpenAPIObject, OpenAPIReadOutput>
export type TestReaderFactory = (config: TestReaderConfig) => ContentReader<OpenAPIObject, OpenAPIReadOutput>

export type ReaderFactoriesByFormat<T> = {
  json: T
  yaml: T
  mixed: T
}

export type Readers = {
  custom: (config: OpenAPIReadConfig) => ContentReader<OpenAPIObject, OpenAPIReadOutput>
  test: ReaderFactoriesByFormat<TestReaderFactory>
  http: ReaderFactoriesByFormat<ReaderFactory>
  https: ReaderFactoriesByFormat<ReaderFactory>
  file: ReaderFactoriesByFormat<ReaderFactory>
  mixed: ReaderFactoriesByFormat<ReaderFactory>
}
