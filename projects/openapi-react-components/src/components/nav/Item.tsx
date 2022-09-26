import styled, { css } from 'styled-components'

const itemStyle = (active: boolean) => css`
  padding: 8px 24px;
  display: grid;
  gap: 4px;
  grid-template-areas:
    'method . url'
    'label label label';
  grid-template-columns: auto-fit 1fr auto-fit;
  font-family: ${(props) => props.theme.textFontFamily};
  background-color: ${(props) =>
    active ? props.theme.nav.item.activeBackgroundColor : props.theme.nav.item.backgroundColor};
  color: ${(props) => (active ? props.theme.nav.item.activeTextColor : props.theme.nav.item.textColor)};
  font-size: ${(props) => props.theme.nav.item.fontSize};
`

export const InactiveItem = styled.div`
  ${itemStyle(false)};
`
export const ActiveItem = styled.div`
  ${itemStyle(true)}
`
