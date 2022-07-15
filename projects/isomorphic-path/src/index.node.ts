import {
  sep as nSep,
  join as nJoin,
  resolve as nResolve,
  relative as nRelative,
  dirname as nDirname,
  parse as nParse,
} from 'path-browserify'

import { Path } from './types'

const nodePath: Path = {
  sep: nSep,
  join: nJoin,
  resolve: nResolve,
  relative: nRelative,
  dirname: nDirname,
  parse: nParse,
}

export const { sep, join, resolve, relative, dirname, parse } = nodePath
export { ParsedPath } from './types'
