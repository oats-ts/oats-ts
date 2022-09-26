import { HttpMethod } from '@oats-ts/openapi-http'
import styled, { css } from 'styled-components'

const chipCss = (method: HttpMethod) => css`
  padding: 1px 5px;
  border-radius: 4px;
  font-weight: 700;
  grid-area: method;
  text-transform: uppercase;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  font-family: ${(props) => props.theme.textFontFamily};
  font-size: ${(props) => props.theme.nav.methods.fontSize};
  color: ${(props) => props.theme.nav.methods[method].textColor};
  background-color: ${(props) => props.theme.nav.methods[method].backgroundColor};
  content: '${method}';
`

export const GetChip = styled.div`
  &::before {
    ${chipCss('get')};
  }
`
export const PostChip = styled.div`
  &::before {
    ${chipCss('post')};
  }
`
export const PutChip = styled.div`
  &::before {
    ${chipCss('put')};
  }
`
export const PatchChip = styled.div`
  &::before {
    ${chipCss('patch')};
  }
`
export const DeleteChip = styled.div`
  &::before {
    ${chipCss('delete')};
  }
`
export const HeadChip = styled.div`
  &::before {
    ${chipCss('head')};
  }
`
export const TraceChip = styled.div`
  &::before {
    ${chipCss('trace')};
  }
`
export const OptionsChip = styled.div`
  &::before {
    ${chipCss('options')};
  }
`
