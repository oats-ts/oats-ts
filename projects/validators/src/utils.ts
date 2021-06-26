import { DefaultConfig } from './defaults'
import { Severity, ValidatorConfig } from './typings'

export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function hasOwnProperty(obj: object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property)
}

export function getSeverity(
  issueType: string,
  config: ValidatorConfig,
  defaultSeverity: Severity = Severity.ERROR,
): string {
  if (isNil(config) || isNil(config.severities)) {
    return defaultSeverity
  }
  if (!hasOwnProperty(config.severities, issueType)) {
    return defaultSeverity
  }
  return config.severities[issueType]
}

export function getConfig(config: Partial<ValidatorConfig>): ValidatorConfig {
  if (isNil(config)) {
    return DefaultConfig
  }
  if (!isNil(config.append) && !isNil(config.path)) {
    return config as ValidatorConfig
  }
  return { ...DefaultConfig, ...config }
}
