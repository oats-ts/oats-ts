import { createRoot } from 'react-dom/client'
import React, { ComponentType } from 'react'
import { Container } from './components/Container'
import { Content } from './components/content/Content'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './defaultTheme'
import { Logo } from './components/Logo'
import { HttpMethod } from '@oats-ts/openapi-http'
import { Interactive } from './components/Interactive'
import { Title3, Title1, Title2 } from './components/content/Title'
import { Nav } from './components/nav/Nav'
import { SectionTitle } from './components/nav/SectionTitle'
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
import { Table, TBody, Td, Th, THead, Tr } from './components/content/Table'
import { SchemaType } from './types'
import {
  ArrayChip,
  BooleanChip,
  EnumChip,
  IntersectionChip,
  LiteralChip,
  NumberChip,
  ObjectChip,
  RecordChip,
  RefChip,
  StringChip,
  TupleChip,
  UnionChip,
  UnknownChip,
} from './components/nav/TypeChips'

const methods: Record<HttpMethod, ComponentType> = {
  get: GetChip,
  post: PostChip,
  put: PutChip,
  patch: PatchChip,
  delete: DeleteChip,
  head: HeadChip,
  options: OptionsChip,
  trace: TraceChip,
}

const types: Record<SchemaType, ComponentType> = {
  array: ArrayChip,
  boolean: BooleanChip,
  enum: EnumChip,
  intersection: IntersectionChip,
  literal: LiteralChip,
  number: NumberChip,
  object: ObjectChip,
  record: RecordChip,
  ref: RefChip,
  string: StringChip,
  tuple: TupleChip,
  union: UnionChip,
  unknown: UnknownChip,
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={defaultTheme}>
    <Container>
      <Nav>
        <Logo>🌱 oats</Logo>
        <SectionTitle>Paths</SectionTitle>
        {Object.entries(methods).map(([method, Chip]) => {
          const Item = method === 'put' ? ActiveItem : InactiveItem
          return (
            <Item key={method}>
              <Chip />
              <Path>/foo/bar/{method}/bububu</Path>
            </Item>
          )
        })}

        <SectionTitle>Schemas</SectionTitle>
        {Object.entries(types).map(([type, Chip]) => {
          const Item = InactiveItem
          return (
            <Item key={type}>
              <Path>{type.charAt(0).toUpperCase() + type.slice(1)}Type</Path>
              <Chip />
            </Item>
          )
        })}
      </Nav>
      <Content>
        <Title1>/foo/bar/put</Title1>
        <Summary>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Summary>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quam turpis, laoreet eu nulla vitae,
          tempus ornare mauris. Etiam vulputate diam eu nibh consectetur sodales. Sed imperdiet aliquam finibus.
        </Description>
        <Title2>Request</Title2>
        <Title3>Query parameters</Title3>
        <Table>
          <THead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Style</Th>
              <Th>Description</Th>
            </Tr>
          </THead>
          <TBody>
            <Tr>
              <Td>foo</Td>
              <Td>number</Td>
              <Td>form</Td>
              <Td>Suspendisse quam turpis, laoreet eu nulla</Td>
            </Tr>
          </TBody>
        </Table>
        <Title3>Path parameters</Title3>
        <Table>
          <THead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Style</Th>
              <Th>Description</Th>
            </Tr>
          </THead>
          <TBody>
            <Tr>
              <Td>foo</Td>
              <Td>number</Td>
              <Td>form</Td>
              <Td>Consectetur adipiscing elit.</Td>
            </Tr>
            <Tr>
              <Td>foobar</Td>
              <Td>string</Td>
              <Td>form</Td>
              <Td>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quam turpis, laoreet eu nulla
                vitae, tempus ornare mauris. Etiam vulputate diam eu nibh consectetur sodales. Sed imperdiet aliquam
                finibus.
              </Td>
            </Tr>
            <Tr>
              <Td>bar</Td>
              <Td>number</Td>
              <Td>form</Td>
              <Td>Lorem ipsum dolor sit amet</Td>
            </Tr>
          </TBody>
        </Table>
        <Title3>Request headers</Title3>
        <Table>
          <THead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Style</Th>
              <Th>Description</Th>
            </Tr>
          </THead>
          <TBody>
            <Tr>
              <Td>X-Foo</Td>
              <Td>string</Td>
              <Td>simple</Td>
              <Td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Td>
            </Tr>
            <Tr>
              <Td>X-Bar</Td>
              <Td>string</Td>
              <Td>simple</Td>
              <Td>Lorem ipsum dolor sit amet</Td>
            </Tr>
          </TBody>
        </Table>
        <Title2>Response</Title2>
      </Content>
      <Interactive>Hello</Interactive>
    </Container>
  </ThemeProvider>,
)
