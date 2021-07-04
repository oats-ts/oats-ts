import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { isNil, isEmpty } from 'lodash'
import { isReferenceObject, OpenAPIObject, ReferenceObject } from 'openapi3-ts'
import { OpenAPIAccessor, OpenAPIGenerator } from './typings'
import { OpenAPIGeneratorConfig, OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { ImportDeclaration } from 'typescript'

export class OpenAPIAccessorImpl implements OpenAPIAccessor {
  private readonly data: OpenAPIReadOutput
  private readonly config: OpenAPIGeneratorConfig
  private readonly generators: OpenAPIGenerator[]

  constructor(config: OpenAPIGeneratorConfig, data: OpenAPIReadOutput, generators: OpenAPIGenerator[]) {
    this.data = data
    this.config = config
    this.generators = generators
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
    return this.config.name(input, this.data.objectToName.get(input), target)
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
      const result = generator.reference(input, target)
      if (!isNil(result)) {
        return result
      }
    }
    return undefined
  }

  dependencies(fromPath: string, input: any, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    for (const generator of this.generators) {
      if (isNil(generator.dependencies)) {
        continue
      }
      const result = generator.dependencies(fromPath, input, target)
      if (!isEmpty(result)) {
        return result
      }
    }
    return []
  }
}
