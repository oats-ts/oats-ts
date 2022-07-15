import {
  sep as bSep,
  join as bJoin,
  resolve as bResolve,
  relative as bRelative,
  dirname as bDirname,
  parse as bParse,
} from 'path-browserify'

import { Path } from './types'

const browserPath: Path = {
  sep: bSep,
  join: bJoin,
  resolve: bResolve,
  relative: bRelative,
  dirname: bDirname,
  parse: bParse,
}

export const { sep, join, resolve, relative, dirname, parse } = browserPath
export { ParsedPath } from './types'
