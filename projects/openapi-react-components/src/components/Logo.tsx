import styled from 'styled-components'

export const Logo = styled.h1`
  font-family: ${(props) => props.theme.textFontFamily};
  font-size: 30px;
  margin: 24px;
  color: ${(props) => props.theme.nav.item.activeBackgroundColor};
`