import { Hono } from 'hono'
import { signUp } from './signup'
import { signIn } from './signin'
import { forgotPassword } from './forgot-password'

const auth = new Hono()

auth.post('/signup', signUp)
auth.post('/signin', signIn)
auth.post('/forgot-password', forgotPassword)

export default auth
export * from './signup'
export * from './signin'
export * from './forgot-password'
export * from './type'
export * from './validation'
