import styled from 'styled-components'

export const Table = styled.table`
  border-spacing: ${({ theme }) => theme.spacing.nil}; ;
`

export const TBody = styled.tbody``

export const THead = styled.thead``

export const Th = styled.th`
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid gray;
  font-family: ${({ theme }) => theme.fontFamily.text};
  font-size: ${({ theme }) => theme.fontSize.s};
  padding: ${({ theme }) => theme.spacing.m};
`

export const Td = styled.td`
  border-bottom: 1px solid gray;
  font-family: ${({ theme }) => theme.fontFamily.text};
  font-size: ${({ theme }) => theme.fontSize.s};
  padding: ${({ theme }) => theme.spacing.m};
`
export const Tr = styled.tr`
  /* &:last-child > ${Td} {
    border-bottom-width: 0px;
  } */
`
