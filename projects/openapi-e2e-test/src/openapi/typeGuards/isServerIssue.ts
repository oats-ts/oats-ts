import { ServerIssue } from '../types/ServerIssue'

export function isServerIssue(input: any): input is ServerIssue {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.message === null || input.message === undefined || typeof input.message === 'string')
  )
}
