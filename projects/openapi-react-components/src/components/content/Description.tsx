import styled from 'styled-components'

export const Description = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s};
  font-family: ${({ theme }) => theme.fontFamily.text};
  color: ${({ theme }) => theme.content.container.textColor};
`
