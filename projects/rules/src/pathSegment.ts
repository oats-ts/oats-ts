export type SegmentLocation = 'path' | 'query'

export type ParameterSegment = {
  type: 'parameter'
  name: string
  location: SegmentLocation
}

export type TextSegment = {
  type: 'text'
  value: string
  location: SegmentLocation
}

export type PathSegment = ParameterSegment | TextSegment
