import { isReferenceObject, OpenAPIObject, ReferenceObject } from 'openapi3-ts'
import { entries, isNil } from '../../utils'
import { findByFragments } from '../findByFragments'
import { URIManipulator } from '../types/URIManipulator'
import { OpenAPIUtils } from './typings'

type OpenAPIDocuments = Map<string, OpenAPIObject>
type ComponentToUri = Map<any, string>

function getOwnerDocument(uri: URIManipulator, documents: OpenAPIDocuments, ref: string): OpenAPIObject {
  const documentUri = uri.document(ref)
  const document = documents.get(documentUri)
  if (isNil(document)) {
    throw new TypeError(`Unexpected document uri ${documentUri}.`)
  }
  return document
}

function addNameMappings<T>(docPart: Record<string, T>, mappings: Map<any, string>): void {
  for (const [name, item] of entries(docPart)) {
    mappings.set(item, name)
  }
}

function createNameMappings(documents: OpenAPIDocuments): Map<any, string> {
  const mappings = new Map<any, string>()
  for (const document of Array.from(documents.values())) {
    const { headers, parameters, schemas } = document?.components || {}
    addNameMappings(headers || {}, mappings)
    addNameMappings(parameters || {}, mappings)
    addNameMappings(schemas || {}, mappings)
  }
  return mappings
}

export const dereferenceUri =
  (uri: URIManipulator, documents: OpenAPIDocuments) =>
  <T>(ref: string): T =>
    findByFragments<T>(getOwnerDocument(uri, documents, ref), uri.fragments(ref))

export const dereference =
  (uri: URIManipulator, documents: OpenAPIDocuments) =>
  <T>(input: T | ReferenceObject): T =>
    isReferenceObject(input)
      ? findByFragments<T>(getOwnerDocument(uri, documents, input.$ref), uri.fragments(input.$ref))
      : input

export const nameOf = (documents: OpenAPIDocuments) => {
  const mapping = createNameMappings(documents)
  return (input: any): string => mapping.get(input)
}

export const uriOf =
  (compToUri: ComponentToUri) =>
  (input: any): string =>
    compToUri.get(input)

export function createOpenAPIUtils(
  uri: URIManipulator,
  documents: OpenAPIDocuments,
  compToUri: ComponentToUri,
): OpenAPIUtils {
  return {
    dereference: dereference(uri, documents),
    dereferenceUri: dereferenceUri(uri, documents),
    nameOf: nameOf(documents),
    uriOf: uriOf(compToUri),
  }
}
