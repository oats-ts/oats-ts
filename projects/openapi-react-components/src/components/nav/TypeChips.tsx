import styled, { css } from 'styled-components'
import { SchemaType } from '../../types'
import { chip } from './chip'

function typeChip(type: SchemaType) {
  return css`
    ${({ theme }) => chip(type, theme.nav.types[type].textColor, theme.nav.types[type].backgroundColor)}
  `
}

export const ArrayChip = styled.div`
  ${typeChip('array')};
`
export const BooleanChip = styled.div`
  ${typeChip('boolean')};
`
export const EnumChip = styled.div`
  ${typeChip('enum')};
`
export const IntersectionChip = styled.div`
  ${typeChip('intersection')};
`
export const LiteralChip = styled.div`
  ${typeChip('literal')};
`
export const NumberChip = styled.div`
  ${typeChip('number')};
`
export const ObjectChip = styled.div`
  ${typeChip('object')};
`
export const RecordChip = styled.div`
  ${typeChip('record')};
`
export const RefChip = styled.div`
  ${typeChip('ref')};
`
export const StringChip = styled.div`
  ${typeChip('string')};
`
export const TupleChip = styled.div`
  ${typeChip('tuple')};
`
export const UnionChip = styled.div`
  ${typeChip('union')};
`
export const UnknownChip = styled.div`
  ${typeChip('unknown')};
`
