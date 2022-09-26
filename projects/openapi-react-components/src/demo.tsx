import { createRoot } from 'react-dom/client'
import React from 'react'
import { Container } from './components/Container'
import { NavBar } from './components/NavBar'
import { Content } from './components/Content'
import { NavItem } from './components/NavItem'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './defaultTheme'
import { MethodChip } from './components/MethodChip'
import { NavUrl } from './components/NavUrl'
import { NavLabel } from './components/NavLabel'
import { Logo } from './components/Logo'
import { NavHeader } from './components/NavHeader'
import { HttpMethod } from '@oats-ts/openapi-http'

const methods: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={defaultTheme}>
    <Container>
      <NavBar>
        <Logo>oats</Logo>
        <NavHeader>Paths</NavHeader>
        {methods.map((method) => (
          <NavItem active={method === 'head'}>
            <MethodChip method={method} />
            <NavUrl>/foo/bar/{method}</NavUrl>
            {method === 'head' ? (
              <NavLabel>
                It is a long established fact that a reader will be distracted by the readable content of a page.
              </NavLabel>
            ) : null}
          </NavItem>
        ))}
        <NavHeader>Schemas</NavHeader>
      </NavBar>
      <Content>Content goes here</Content>
    </Container>
  </ThemeProvider>,
)
