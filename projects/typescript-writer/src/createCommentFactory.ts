import { CommentConfig } from './typings'

/*
 * Typescript doesn't have nice AST representation for comments,
 * hence the makeshift comment representation.
 */

function createLineComment(comment: string, lineSep: string): string {
  return comment
    .split(lineSep)
    .map((line) => `// ${line}`)
    .concat([''])
    .join(lineSep)
}

function createCommonBlockComment(
  comment: string,
  lineSep: string,
  begin: string,
  lineBegin: string,
  end: string,
): string {
  const lines = comment.split(lineSep)
  if (lines.length === 1) {
    return `${begin} ${comment}${end}${lineSep}`
  } else {
    return [begin, ...lines.map((line) => `${lineBegin} ${line}`), end, ''].join(lineSep)
  }
}

function createBlockComment(comment: string, lineSep: string): string {
  return createCommonBlockComment(comment, lineSep, '/*', ' *', ' */')
}

function createJsDocComment(comment: string, lineSep: string): string {
  return createCommonBlockComment(comment, lineSep, '/**', ' *', ' */')
}

export function createCommentFactory(lineSep: string) {
  return function _createComment(comment: CommentConfig): string {
    switch (comment.type) {
      case 'line':
        return createLineComment(comment.text, lineSep)
      case 'block':
        return createBlockComment(comment.text, lineSep)
      case 'jsdoc':
        return createJsDocComment(comment.text, lineSep)
    }
  }
}
