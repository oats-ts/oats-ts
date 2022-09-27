import styled from 'styled-components'

export const SectionTitle = styled.div`
  padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.l};
  font-weight: 700;
  color: #022b3a;
  text-transform: uppercase;
  font-family: ${({ theme }) => theme.fontFamily.text};
  font-size: ${({ theme }) => theme.fontSize.s};
`
