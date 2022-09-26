import { createRoot } from 'react-dom/client'
import React, { ComponentType } from 'react'
import { Container } from './components/Container'
import { Content } from './components/content/Content'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './defaultTheme'
import { Logo } from './components/Logo'
import { HttpMethod } from '@oats-ts/openapi-http'
import { Interactive } from './components/Interactive'
import { Title } from './components/content/Title'
import { NavBar } from './components/nav/NavBar'
import { SectionHeader } from './components/nav/SectionHeader'
import { ActiveItem, InactiveItem } from './components/nav/Item'
import { Path } from './components/nav/Path'
import {
  DeleteChip,
  GetChip,
  HeadChip,
  OptionsChip,
  PatchChip,
  PostChip,
  PutChip,
  TraceChip,
} from './components/nav/MethodChips'
import { Description } from './components/content/Description'
import { Summary } from './components/content/Summary'

const methods: [HttpMethod, ComponentType][] = [
  ['get', GetChip],
  ['post', PostChip],
  ['put', PutChip],
  ['patch', PatchChip],
  ['delete', DeleteChip],
  ['head', HeadChip],
  ['options', OptionsChip],
  ['trace', TraceChip],
]

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={defaultTheme}>
    <Container>
      <NavBar>
        <Logo>🌱 oats</Logo>
        <SectionHeader>Paths</SectionHeader>
        {methods.map(([method, Chip]) => {
          const Item = method === 'put' ? ActiveItem : InactiveItem
          return (
            <Item key={method}>
              <Chip />
              <Path>/foo/bar/{method}/bububu</Path>
            </Item>
          )
        })}
        <SectionHeader>Schemas</SectionHeader>
      </NavBar>
      <Content>
        <Title>/foo/bar/put</Title>
        <Summary>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Summary>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quam turpis, laoreet eu nulla vitae,
          tempus ornare mauris. Etiam vulputate diam eu nibh consectetur sodales. Sed imperdiet aliquam finibus.
        </Description>
      </Content>
      <Interactive></Interactive>
    </Container>
  </ThemeProvider>,
)
