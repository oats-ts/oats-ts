export type GithubFileDescriptor = {
  path: string
  mode: string
  type: 'tree' | 'blob'
  sha: string
  size: number
  url: string
}

export type LocalFileDescriptor = {
  path: string
  filePath: string
  content: string
}

export type GeneratorInputFileDescriptor = {
  name: string
  schemaUri: string
  codeFolderPath: string
  codeFilePath: string
}

export type LoadMethod = 'file' | 'https'
