import express, { Request, Response, json } from 'express'

export const firstRoute = express
  .Router({ mergeParams: false, strict: true, caseSensitive: true })
  .get('/foo/bar/', (req: Request, res: Response) => {
    res.json({ path: req.path })
  })

type Foo = { foo: string }

export const secondRoute = express
  .Router()
  .use(json())
  .get<string, any, any, any, any, Foo>(
    '/foo/bar/foobar/',
    (req: Request, res: Response) => {
      req.query = { foo: 'bar' }
    },
    (req, res) => {
      res.json({ path: req.path, query: req.query, locals: res.locals })
    },
  )

const app = express().use(firstRoute, secondRoute)

app.listen(3000, () => {
  console.log('running on 3000')
})
