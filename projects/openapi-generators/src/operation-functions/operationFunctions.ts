import { OperationFunctionsGeneratorConfig } from './typings'
import { OperationFunctionsGenerator } from './OperationFunctionsGenerator'
import { OpenAPIGenerator } from '../types'
import { GeneratorConfig } from '@oats-ts/oats-ts'

function defaultConfig({
  documentation,
  validate,
  sendCookieHeader,
  parseSetCookieHeaders,
  ...rest
}: Partial<OperationFunctionsGeneratorConfig & GeneratorConfig>): OperationFunctionsGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    validate: validate ?? true,
    sendCookieHeader: sendCookieHeader ?? false,
    parseSetCookieHeaders: parseSetCookieHeaders ?? false,
    ...rest,
  }
}

export function operationFunctions(config: Partial<OperationFunctionsGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new OperationFunctionsGenerator(defaultConfig(config))
}
