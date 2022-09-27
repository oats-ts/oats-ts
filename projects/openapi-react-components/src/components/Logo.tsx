import styled from 'styled-components'

export const Logo = styled.h1`
  font-family: ${({ theme }) => theme.fontFamily.text};
  font-size: ${({ theme }) => theme.fontSize.xl};
  margin: ${({ theme }) => theme.spacing.l};
  color: ${({ theme }) => theme.nav.item.activeBackgroundColor};
`
