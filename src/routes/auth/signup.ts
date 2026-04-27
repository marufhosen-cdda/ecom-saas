import { Context } from 'hono'
import { prisma } from '../../lib/prisma'
import { hashPassword } from '../../utils/password'
import { signUpSchema } from './validation'
import { generateAccessToken } from '../../utils/jwt'

export const signUp = async (c: Context) => {
  try {
    const body = await c.req.json()
    const result = signUpSchema.safeParse(body)

    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.format() 
      }, 400)
    }

    const { email, password, name } = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return c.json({ error: 'User already exists with this email' }, 409)
    }

    const hashedPassword = await hashPassword(password)

    // Create user and assign role in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name,
        }
      })

      // Find CUSTOMER role
      const customerRole = await tx.role.findUnique({
        where: { name: 'CUSTOMER' }
      })

      if (customerRole) {
        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: customerRole.id,
            storeId: null // Platform-wide role for customer
          }
        })
      }

      return newUser
    })

    // Generate token (assuming JWT_SECRET is in env)
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
    const token = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: 'CUSTOMER' // Default role
    }, jwtSecret)

    return c.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    }, 201)

  } catch (error) {
    console.error('SignUp Error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
