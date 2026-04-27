import { Context } from 'hono'
import { prisma } from '../../lib/prisma'
import { forgotPasswordSchema } from './validation'

export const forgotPassword = async (c: Context) => {
  try {
    const body = await c.req.json()
    const result = forgotPasswordSchema.safeParse(body)

    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.format() 
      }, 400)
    }

    const { email } = result.data

    const user = await prisma.user.findUnique({
      where: { email }
    })

    // For security, always return success even if user doesn't exist
    if (!user) {
      return c.json({ 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      }, 200)
    }

    // Generate reset token (in a real app, use a more secure random string)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const resetTokenExp = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp
      }
    })

    // TODO: Send email with reset token
    console.log(`Password reset token for ${email}: ${resetToken}`)

    return c.json({ 
      message: 'If an account exists with this email, a password reset link has been sent.' 
    }, 200)

  } catch (error) {
    console.error('ForgotPassword Error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
