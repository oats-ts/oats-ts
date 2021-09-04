import { CommentsConfig } from '../typings'

export function defaultCommentsConfig(config: CommentsConfig = {}): CommentsConfig {
  return {
    leadingComments: config.leadingComments ? config.leadingComments : [],
    trailingComments: config.trailingComments ? config.trailingComments : [],
    lineSeparator: config.lineSeparator ? config.lineSeparator : '\n',
  }
}
