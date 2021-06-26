import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { entries, isNil, memoize } from 'lodash'
import { isReferenceObject, OpenAPIObject, ReferenceObject } from 'openapi3-ts'
import { OpenAPIAccessor, OpenAPIGenerator, OpenAPIGeneratorConfig, OpenAPIGeneratorTarget } from '../typings'

export class OpenAPIAccessorImpl implements OpenAPIAccessor {
  private readonly data: OpenAPIReadOutput
  private readonly config: OpenAPIGeneratorConfig
  private readonly generators: OpenAPIGenerator[]
  private readonly nameToObject: Map<any, string>

  constructor(config: OpenAPIGeneratorConfig, data: OpenAPIReadOutput, generators: OpenAPIGenerator[]) {
    this.data = data
    this.config = config
    this.generators = generators
    this.nameToObject = createNameToObjectMapping(data.documents)
  }

  document(): OpenAPIObject {
    return this.data.document
  }

  documents(): OpenAPIObject[] {
    return Array.from(this.data.documents.values())
  }

  dereference<T>(input: T | ReferenceObject | string): T {
    if (typeof input === 'string') {
      return this.data.uriToObject.get(input)
    } else if (isReferenceObject(input)) {
      return this.data.uriToObject.get(input.$ref)
    }
    return input
  }

  name(input: any, target: string): string {
    return this.config.name(input, this.nameToObject.get(input), target)
  }

  path(input: any, target: string): string {
    return this.config.path(input, this.name.bind(this), target)
  }

  uri(input: any): string {
    return this.data.objectToUri.get(input)
  }

  reference<T>(input: any, target: OpenAPIGeneratorTarget): T {
    for (const generator of this.generators) {
      if (isNil(generator.reference)) {
        continue
      }
      const result = generator.reference(this.data, this.generators, input, target)
      if (!isNil(result)) {
        return result
      }
    }
    return undefined
  }
}

function addNameMappings<T>(docPart: Record<string, T>, mappings: Map<any, string>): void {
  for (const [name, item] of entries(docPart)) {
    mappings.set(item, name)
  }
}

const createNameToObjectMapping = memoize(function createNameToObjectMapping(
  documents: Map<string, OpenAPIObject>,
): Map<any, string> {
  const mappings = new Map<any, string>()
  for (const document of Array.from(documents.values())) {
    const { headers, parameters, schemas } = document?.components || {}
    addNameMappings(headers || {}, mappings)
    addNameMappings(parameters || {}, mappings)
    addNameMappings(schemas || {}, mappings)
  }
  return mappings
})
