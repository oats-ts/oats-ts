import styled from 'styled-components'

export const Title = styled.h1`
  font-family: ${(props) => props.theme.textFontFamily};
  font-size: 30px;
  margin: 0px;
  color: ${(props) => props.theme.content.container.textColor};
`
