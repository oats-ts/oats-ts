import { forbidFields } from './forbidFields'

export const ignore = <T>(fields: (keyof T)[]) =>
  forbidFields(fields, (field) => `"${field}" will be ignored`, 'warning')
