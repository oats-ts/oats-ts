import styled from 'styled-components'

export const Content = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: ${({ theme }) => theme.content.container.backgroundColor};
  gap: ${({ theme }) => theme.spacing.l};
  padding: ${({ theme }) => theme.spacing.l};
`
