import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-areas: 'nav content interactive';
  grid-template-columns: 1fr 3fr 3fr;
`