import styled from 'styled-components'

export const Logo = styled.h1`
  font-family: ${(props) => props.theme.textFontFamily};
  font-size: 30px;
  margin: 10px 24px;
  color: ${(props) => props.theme.navItem.activeBackgroundColor};
`
