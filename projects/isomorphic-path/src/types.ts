export type ParsedPath = {
  root: string
  dir: string
  base: string
  ext: string
  name: string
}

export type Path = {
  sep: string
  join: (...segments: string[]) => string
  resolve: (...segments: string[]) => string
  relative: (from: string, to: string) => string
  dirname: (path: string) => string
  parse: (path: string) => ParsedPath
}
