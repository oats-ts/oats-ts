import { OpenAPIObject, ReferenceObject } from 'openapi3-ts'
import type { Issue } from '@oats-ts/validators'
import type { Try } from '@oats-ts/generator'
import type { BabelGeneratorOutput } from '@oats-ts/babel-writer'

/** Configuration object for generating code from OpenAPI documents. */
export type OpenAPIGeneratorConfig = {
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param name The name of the object.
   * @param target The generator target (type definition, operation, etc).
   * @returns The desired name based on the parameters.
   */
  name?(input: any, name: string, target: string): string
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param name The name of the object.
   * @param target The generator target (type definition, operation, etc).
   * @returns The operating system dependent path for the desired generator target.
   */
  path(input: any, name: string, target: string): string
}

export type OpenAPIAccessor = {
  document(): OpenAPIObject
  documents(): OpenAPIObject[]
  dereference<T>(input: string | T | ReferenceObject): T
  name(input: any, target: string): string
  path(input: any, target: string): string
  uri(input: any): string
}

export type OpenAPIGeneratorContext = {
  accessor: OpenAPIAccessor
  issues: Issue[]
}

export type OpenAPIChildGenerator = (context: OpenAPIGeneratorContext) => Promise<Try<BabelGeneratorOutput>>
