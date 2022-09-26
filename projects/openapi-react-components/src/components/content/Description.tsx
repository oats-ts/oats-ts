import styled from 'styled-components'

export const Description = styled.div`
  font-size: ${(props) => props.theme.content.container.fontSize};
  font-family: ${(props) => props.theme.textFontFamily};
  color: ${(props) => props.theme.content.container.textColor};
`
