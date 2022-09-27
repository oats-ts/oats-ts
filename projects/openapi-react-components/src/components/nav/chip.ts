import { css } from 'styled-components'

export function chip(label: string, textColor: string, backgroundColor: string) {
  return css`
    &::before {
      padding: 1px 5px;
      border-radius: 4px;
      font-weight: 700;
      text-transform: uppercase;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
      font-family: ${({ theme }) => theme.fontFamily.text};
      font-size: ${({ theme }) => theme.fontSize.xs};
      color: ${textColor};
      background-color: ${backgroundColor};
      content: '${label}';
    }
  `
}
