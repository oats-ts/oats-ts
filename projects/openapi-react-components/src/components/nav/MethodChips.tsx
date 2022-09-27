import { HttpMethod } from '@oats-ts/openapi-http'
import styled, { css } from 'styled-components'
import { chip } from './chip'

function methodChip(method: HttpMethod) {
  return css`
    ${({ theme }) => chip(method, theme.nav.methods[method].textColor, theme.nav.methods[method].backgroundColor)}
  `
}

export const GetChip = styled.div`
  ${methodChip('get')};
`
export const PostChip = styled.div`
  ${methodChip('post')};
`
export const PutChip = styled.div`
  ${methodChip('put')};
`
export const PatchChip = styled.div`
  ${methodChip('patch')};
`
export const DeleteChip = styled.div`
  ${methodChip('delete')};
`
export const HeadChip = styled.div`
  ${methodChip('head')};
`
export const TraceChip = styled.div`
  ${methodChip('trace')};
`
export const OptionsChip = styled.div`
  ${methodChip('options')};
`
