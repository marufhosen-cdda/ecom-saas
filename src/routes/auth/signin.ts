import { Context } from 'hono'
import { prisma } from '../../lib/prisma'
import { verifyPassword } from '../../utils/password'
import { signInSchema } from './validation'
import { generateAccessToken } from '../../utils/jwt'

export const signIn = async (c: Context) => {
  try {
    const body = await c.req.json()
    const result = signInSchema.safeParse(body)

    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.format() 
      }, 400)
    }

    const { email, password } = result.data

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user || !user.passwordHash) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Get primary role
    const primaryRole = user.userRoles[0]?.role.name || 'CUSTOMER'

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
    const token = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: primaryRole
    }, jwtSecret)

    return c.json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    }, 200)

  } catch (error) {
    console.error('SignIn Error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
