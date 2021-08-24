import { AsyncApiObject } from '@oats-ts/asyncapi-model'

/** Configuration object for reading OpenAPI documents. */
export type AsyncAPIReadConfig = {
  /** The path of the documents. Either a full URI or local file path. */
  path: string
  /**
   * @param uri The full URI of the document.
   * @returns The contents of the URI parsed as an OpenAPI document.
   */
  resolve?(uri: string): Promise<AsyncApiObject>
  /** Collection of functions to manipualte URIs */
  uriManipulator?: URIManipulator
}

/** Globaly used utility to work with URIs found in OpenAPI refs and discriminators. */
export type URIManipulator = {
  /**
   * @param path A URI fragment.
   * @param segments Possibly other URI fragment pieces.
   * @returns A URI fragment composed from the pieces
   */
  append(path: string, ...segments: string[]): string
  /**
   * @param ref A partial or full URI (possibly just a fragment).
   * @param parent A full URI.
   * @returns A resolved full URI.
   */
  resolve(ref: string, parent: string): string
  /**
   * @param path A path or URI
   * @returns A full URI based on the path. If it's a valid URI returns as is, if a file turns it into a URI with file:// protocol.
   */
  sanitize(path: string): string
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

export type AsyncAPIReadOutput = {
  /** The full URI of the root document */
  documentUri: string
  /** The root AsyncApi document */
  document: AsyncApiObject
  /** An URI -> AsyncApi document map. Contains all referenced documents fully resolved. */
  documents: Map<string, AsyncApiObject>
  /** An object -> URI mapping for all the objects the resolution traversed */
  objectToUri: Map<any, string>
  /** An URI -> object mapping for all the objects the resolution traversed */
  uriToObject: Map<string, any>
  /** An object -> name mapping for entites that don't encapsulate their names, eg.: schemas. */
  objectToName: Map<any, string>
}
