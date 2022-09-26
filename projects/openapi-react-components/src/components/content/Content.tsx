import styled from 'styled-components'

export const Content = styled.div`
  background-color: ${(props) => props.theme.content.container.backgroundColor};
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`
