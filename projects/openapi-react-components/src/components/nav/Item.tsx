import styled, { css } from 'styled-components'

const itemStyle = (active: boolean) => css`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.l};
  gap: ${({ theme }) => theme.spacing.s};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* display: grid;
  grid-template-areas: 'method . url';
  grid-template-columns: 60px 1fr 100px; */
  cursor: pointer;
  font-family: ${({ theme }) => theme.fontFamily.text};
  background-color: ${({ theme }) => (active ? theme.nav.item.activeBackgroundColor : theme.nav.item.backgroundColor)};
  color: ${({ theme }) => (active ? theme.nav.item.activeTextColor : theme.nav.item.textColor)};
  font-size: ${({ theme }) => theme.fontSize.s};
`

export const InactiveItem = styled.a`
  ${itemStyle(false)};
`
export const ActiveItem = styled.a`
  ${itemStyle(true)}
`
