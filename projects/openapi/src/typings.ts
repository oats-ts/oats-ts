/**
 * @param input The named object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired name for the object based on target
 */
export type NameProvider = (input: any, target: string) => string

/** Configuration object for generating code from OpenAPI documents. */
export type OpenAPIGeneratorConfig = {
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param originalName The name of the object as described in the document.
   * It's a separate argument, as in many cases it's separate from input object.
   * @param target The generator target (type definition, operation, etc).
   * @returns The desired name based on the parameters.
   */
  name(input: any, originalName: string, target: string): string
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param name A simplified name provider.
   * @param target The generator target (type definition, operation, etc).
   * @returns The operating system dependent path for the desired generator target.
   */
  path(input: any, name: NameProvider, target: string): string
}

export type GeneratorPathProvider = OpenAPIGeneratorConfig['path']
export type GeneratorNameProvider = OpenAPIGeneratorConfig['name']

export type OpenAPIGeneratorTarget =
  | 'openapi/type'
  | 'openapi/type-guard'
  | 'openapi/operation'
  | 'openapi/query-type'
  | 'openapi/path-type'
  | 'openapi/headers-type'
  | 'openapi/response-type'
  | 'openapi/input-type'
  | 'openapi/headers-serializer'
  | 'openapi/query-serializer'
  | 'openapi/path-serializer'
  | 'openapi/expectations'
  | 'openapi/api-type'
  | 'openapi/api-class'
  | 'openapi/api-stub'
  | 'openapi/validator'
