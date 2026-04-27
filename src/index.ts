import { Hono } from 'hono'
import prisma from './lib/prisma'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/users/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return c.json({ error: 'User not found' }, 404)
  return c.json(user)
})

export default app
