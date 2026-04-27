import { z } from 'zod'
import { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema } from './validation'

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export interface AuthResponse {
  user: {
    id: number
    email: string
    name: string | null
  }
  token: string
}
