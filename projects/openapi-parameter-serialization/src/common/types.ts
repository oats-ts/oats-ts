/** Path parsing, represents path segments */
export type ParameterSegment = {
  type: 'parameter'
  name: string
}

export type TextSegment = {
  type: 'text'
  value: string
}

export type PathSegment = ParameterSegment | TextSegment
