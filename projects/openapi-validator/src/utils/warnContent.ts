import { forbidFields } from './forbidFields'

export const warnContent = forbidFields(
  ['content'],
  (field) => `"${field}" will be ignored, use "schema" instead`,
  'warning',
)
