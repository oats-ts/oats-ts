import { OperationsGeneratorConfig } from './typings'
import { OperationsGenerator } from './OperationsGenerator'
import { OpenAPICodeGenerator } from '../types'
import { GeneratorConfig } from '@oats-ts/oats-ts'

function defaultConfig({
  documentation,
  validate,
  sendCookieHeader,
  parseSetCookieHeaders,
  ...rest
}: Partial<OperationsGeneratorConfig & GeneratorConfig>): OperationsGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    validate: validate ?? true,
    sendCookieHeader: sendCookieHeader ?? false,
    parseSetCookieHeaders: parseSetCookieHeaders ?? false,
    ...rest,
  }
}

export function operations(config: Partial<OperationsGeneratorConfig & GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new OperationsGenerator(defaultConfig(config))
}
