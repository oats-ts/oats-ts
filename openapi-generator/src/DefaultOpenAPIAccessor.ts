import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { isReferenceObject, OpenAPIObject, ReferenceObject } from 'openapi3-ts'
import { OpenAPIAccessor, OpenAPIGeneratorConfig } from './typings'
import entries from 'lodash/entries'
import { isNil } from 'lodash'

export class DefaultOpenAPIAccessor implements OpenAPIAccessor {
  private readonly context: OpenAPIReadOutput
  private readonly config: OpenAPIGeneratorConfig
  private readonly nameToObject: Map<any, string>

  constructor(config: OpenAPIGeneratorConfig, context: OpenAPIReadOutput) {
    this.context = context
    this.config = config
    this.nameToObject = createNameToObjectMapping(context.documents)
  }

  document(): OpenAPIObject {
    return this.context.document
  }

  documents(): OpenAPIObject[] {
    return Array.from(this.context.documents.values())
  }

  dereference<T>(input: T | ReferenceObject | string): T {
    if (typeof input === 'string') {
      return this.context.uriToObject.get(input)
    } else if (isReferenceObject(input)) {
      return this.context.uriToObject.get(input.$ref)
    }
    return input
  }

  name(input: any, target: string): string {
    return this.config.name(input, this.nameToObject.get(input), target)
  }

  path(input: any, target: string): string {
    return this.config.path(input, this.name(input, target), target)
  }

  uri(input: any): string {
    return this.context.objectToUri.get(input)
  }
}

function addNameMappings<T>(docPart: Record<string, T>, mappings: Map<any, string>): void {
  for (const [name, item] of entries(docPart)) {
    mappings.set(item, name)
  }
}

function createNameToObjectMapping(documents: Map<string, OpenAPIObject>): Map<any, string> {
  const mappings = new Map<any, string>()
  for (const document of Array.from(documents.values())) {
    const { headers, parameters, schemas } = document?.components || {}
    addNameMappings(headers || {}, mappings)
    addNameMappings(parameters || {}, mappings)
    addNameMappings(schemas || {}, mappings)
  }
  return mappings
}
