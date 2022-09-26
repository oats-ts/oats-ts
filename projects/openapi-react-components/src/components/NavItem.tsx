import styled from 'styled-components'

export const NavItem = styled.div<{ active?: boolean }>`
  padding: 8px 24px;
  display: grid;
  grid-template-areas:
    'method . url'
    'label label label';
  grid-template-columns: auto-fit 1fr auto-fit;
  font-family: ${(props) => props.theme.textFontFamily};
  background-color: ${(props) =>
    props.active ? props.theme.navItem.activeBackgroundColor : props.theme.navItem.backgroundColor};
  color: ${(props) => (props.active ? props.theme.navItem.activeTextColor : props.theme.navItem.textColor)};
  font-size: ${(props) => props.theme.navItem.fontSize};
`
