import styled from 'styled-components'

export const SectionHeader = styled.div<{ active?: boolean }>`
  padding: 6px 24px;
  font-family: ${(props) => props.theme.textFontFamily};
  font-weight: 700;
  color: #022b3a;
  font-size: 12px;
  text-transform: uppercase;
`
