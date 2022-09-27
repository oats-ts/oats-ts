import styled from 'styled-components'

export const Title1 = styled.h1`
  margin: ${({ theme }) => theme.spacing.nil};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-family: ${({ theme }) => theme.fontFamily.text};
  color: ${({ theme }) => theme.content.container.textColor};
`

export const Title2 = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.l};
  margin: ${({ theme }) => theme.spacing.nil};
  font-family: ${({ theme }) => theme.fontFamily.text};
  color: ${({ theme }) => theme.content.container.textColor};
`

export const Title3 = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.m};
  margin: ${({ theme }) => theme.spacing.nil};
  font-family: ${({ theme }) => theme.fontFamily.text};
  color: ${({ theme }) => theme.content.container.textColor};
`
