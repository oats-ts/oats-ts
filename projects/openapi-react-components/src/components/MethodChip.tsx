import { HttpMethod } from '@oats-ts/openapi-http'
import styled from 'styled-components'

export const MethodChip = styled.div<{ method: HttpMethod }>`
  &::before {
    padding: 1px 5px;
    border-radius: 4px;
    font-weight: 700;
    grid-area: method;
    font-family: ${(props) => props.theme.textFontFamily};
    color: ${(props) => props.theme.methodChip.textColor[props.method]};
    background-color: ${(props) => props.theme.methodChip.backgroundColor[props.method]};
    font-size: ${(props) => props.theme.methodChip.fontSize};
    content: '${(props) => props.method}';
    text-transform: uppercase;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  }
`
